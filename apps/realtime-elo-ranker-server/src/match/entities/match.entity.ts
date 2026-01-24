import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Match {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    playerA: string;
    
    @Column()
    playerB: string;
    
    @Column()
    winner: string;  // ID du gagnant, ou null si draw
    
    @Column({ default: false })
    isDraw: boolean;
}