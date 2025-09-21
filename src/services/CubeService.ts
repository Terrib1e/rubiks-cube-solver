import { Vector3, Quaternion } from 'three';
import { CubeState, Piece, Move, Face, Direction, PieceType, FaceColors } from '../types/cube.types';
import { DEFAULT_CUBE_CONFIG } from '../utils/constants';
import { parseMove, getRotationAxis, getRotationAngle, uuid } from '../utils/helpers';

export class CubeService {
  private state: CubeState;

  constructor(size: number = 3) {
    this.state = this.initializeCube(size);
  }

  private initializeCube(size: number): CubeState {
    const pieces: Piece[] = [];

    // Generate all pieces for the cube
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip the center piece (invisible)
          if (x === 0 && y === 0 && z === 0) continue;

          const position = new Vector3(x, y, z);
          const piece = this.createPiece(position, size);
          pieces.push(piece);
        }
      }
    }

    return {
      size,
      pieces,
      orientation: new Quaternion(),
      isScrambled: false,
      isSolved: true,
      moveHistory: [],
      currentMoveIndex: -1,
      animationQueue: []
    };
  }

  private createPiece(position: Vector3, size: number): Piece {
    const colors: FaceColors = {};
    const pieceType = this.getPieceType(position);

    // Assign colors based on position
    if (position.z === 1) colors.front = DEFAULT_CUBE_CONFIG.colors.front;
    if (position.z === -1) colors.back = DEFAULT_CUBE_CONFIG.colors.back;
    if (position.y === 1) colors.up = DEFAULT_CUBE_CONFIG.colors.up;
    if (position.y === -1) colors.down = DEFAULT_CUBE_CONFIG.colors.down;
    if (position.x === 1) colors.right = DEFAULT_CUBE_CONFIG.colors.right;
    if (position.x === -1) colors.left = DEFAULT_CUBE_CONFIG.colors.left;

    return {
      id: uuid(),
      position: position.clone(),
      rotation: new Quaternion(),
      colors,
      originalPosition: position.clone(),
      type: pieceType
    };
  }

  private getPieceType(position: Vector3): PieceType {
    const nonZeroComponents = [position.x, position.y, position.z].filter(coord => coord !== 0).length;

    switch (nonZeroComponents) {
      case 1: return 'center';
      case 2: return 'edge';
      case 3: return 'corner';
      default: return 'center';
    }
  }

  public getState(): CubeState {
    return { ...this.state };
  }

  public async performMove(notation: string): Promise<void> {
    try {
      const { face, direction, times } = parseMove(notation);

      for (let i = 0; i < times; i++) {
        await this.rotateFace(face, direction);
      }

      const move: Move = {
        notation,
        timestamp: Date.now(),
        duration: DEFAULT_CUBE_CONFIG.animationSpeed,
        pieces: this.getAffectedPieces(face)
      };

      this.addMoveToHistory(move);
      this.updateSolvedState();
    } catch (error) {
      console.error('Error performing move:', error);
    }
  }

  private async rotateFace(face: Face, direction: Direction): Promise<void> {
    const axis = getRotationAxis(face);
    const angle = getRotationAngle(direction);
    const affectedPieces = this.getPiecesOnFace(face);

    // Rotate affected pieces
    affectedPieces.forEach(piece => {
      // Rotate position around the face axis
      piece.position.applyAxisAngle(axis, angle);

      // Rotate the piece itself
      const rotation = new Quaternion().setFromAxisAngle(axis, angle);
      piece.rotation.premultiply(rotation);

      // Update colors based on new orientation
      this.updatePieceColors(piece, face, direction);
    });

    // Simulate animation delay
    return new Promise(resolve => {
      setTimeout(resolve, DEFAULT_CUBE_CONFIG.animationSpeed);
    });
  }

  private getPiecesOnFace(face: Face): Piece[] {
    return this.state.pieces.filter(piece => {
      switch (face) {
        case 'F': return piece.position.z > 0.5;
        case 'B': return piece.position.z < -0.5;
        case 'U': return piece.position.y > 0.5;
        case 'D': return piece.position.y < -0.5;
        case 'R': return piece.position.x > 0.5;
        case 'L': return piece.position.x < -0.5;
        default: return false;
      }
    });
  }

  private updatePieceColors(piece: Piece, face: Face, direction: Direction): void {
    if (piece.type === 'center') return; // Centers don't change colors

    const colors = { ...piece.colors };

    // Rotate colors around the face
    switch (face) {
      case 'F':
        if (direction === 'CW') {
          const temp = colors.up;
          colors.up = colors.left;
          colors.left = colors.down;
          colors.down = colors.right;
          colors.right = temp;
        } else {
          const temp = colors.up;
          colors.up = colors.right;
          colors.right = colors.down;
          colors.down = colors.left;
          colors.left = temp;
        }
        break;
      // Add other face rotations...
    }

    piece.colors = colors;
  }

  private getAffectedPieces(face: Face): string[] {
    return this.getPiecesOnFace(face).map(piece => piece.id);
  }

  private addMoveToHistory(move: Move): void {
    // Remove any moves after current index (for undo/redo functionality)
    this.state.moveHistory = this.state.moveHistory.slice(0, this.state.currentMoveIndex + 1);

    // Add new move
    this.state.moveHistory.push(move);
    this.state.currentMoveIndex++;
  }

  private updateSolvedState(): void {
    this.state.isSolved = this.checkIfSolved();
    this.state.isScrambled = this.state.moveHistory.length > 0 && !this.state.isSolved;
  }

  private checkIfSolved(): boolean {
    // Check if all pieces are in their original positions with correct orientations
    return this.state.pieces.every(piece => {
      const originalPosition = piece.originalPosition;
      const currentPosition = piece.position;

      // Check position (with small tolerance for floating point errors)
      const positionMatch = originalPosition.distanceTo(currentPosition) < 0.1;

      // Check if colors are in correct positions (simplified check)
      return positionMatch;
    });
  }

  public async scramble(moves: number = 25): Promise<void> {
    const faces: Face[] = ['F', 'B', 'U', 'D', 'R', 'L'];
    const modifiers = ['', "'", '2'];

    for (let i = 0; i < moves; i++) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      await this.performMove(face + modifier);
    }
  }

  public reset(): void {
    this.state = this.initializeCube(this.state.size);
  }

  public undo(): boolean {
    if (this.state.currentMoveIndex < 0) return false;

    // Get the move to undo
    const move = this.state.moveHistory[this.state.currentMoveIndex];

    // Perform the inverse move
    const inverseNotation = this.getInverseMove(move.notation);
    this.performMoveWithoutHistory(inverseNotation);

    this.state.currentMoveIndex--;
    this.updateSolvedState();

    return true;
  }

  public redo(): boolean {
    if (this.state.currentMoveIndex >= this.state.moveHistory.length - 1) return false;

    this.state.currentMoveIndex++;
    const move = this.state.moveHistory[this.state.currentMoveIndex];

    this.performMoveWithoutHistory(move.notation);
    this.updateSolvedState();

    return true;
  }

  private async performMoveWithoutHistory(notation: string): Promise<void> {
    const { face, direction, times } = parseMove(notation);

    for (let i = 0; i < times; i++) {
      await this.rotateFace(face, direction);
    }
  }

  private getInverseMove(notation: string): string {
    if (notation.endsWith("'")) {
      return notation.slice(0, -1);
    } else if (notation.endsWith('2')) {
      return notation;
    } else {
      return notation + "'";
    }
  }

  public getMoveHistory(): Move[] {
    return [...this.state.moveHistory];
  }

  public isSolved(): boolean {
    return this.state.isSolved;
  }

  public isScrambled(): boolean {
    return this.state.isScrambled;
  }
}