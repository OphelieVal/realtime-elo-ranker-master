import { Test, TestingModule } from "@nestjs/testing";
import { PlayerService } from "./player.service";
import { Repository } from "typeorm";
import { Player } from "./entities/player.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotFoundException } from "@nestjs/common";

describe("PlayerService", () => {
    let service: PlayerService;
    let repository: Repository<Player>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            PlayerService,
            {
            provide: getRepositoryToken(Player),
            useValue: {
                find: jest.fn(),
                findOne: jest.fn(),
                create: jest.fn(),
                save: jest.fn(),
                delete: jest.fn(),
            },
            },
        ],
        }).compile();

        service = module.get<PlayerService>(PlayerService);
        repository = module.get<Repository<Player>>(getRepositoryToken(Player));
    });

    describe('Create player', () => {
        it('Should create a new player with the given id', async () => {
            // Player initialization
            const dto = { id: "Alice" };
            const player = { ...dto } as Player;

            jest.spyOn(repository, "create").mockReturnValue(player);
            jest.spyOn(repository, "save").mockResolvedValue(player);

            const result = await service.createPlayer(dto as any);

            // Assert success
            expect(result).toEqual(player);
        });
    });

    describe('Find all players', () => {
        it('Should return all the players', async () => {
            const players = [{ id: "Thomas" }] as Player[];
            jest.spyOn(repository, "find").mockResolvedValue(players);

            const result = await service.findAllPlayers();

            expect(result).toEqual(players);
        });
    });

    describe('Find a player', () => {
        it('Should return the player with the corresponding id', async () => {
            const dto = { id: "Camille" };
            const player = { ...dto } as Player;

            jest.spyOn(repository, "findOneBy").mockResolvedValue(player);

            const result = await service.findPlayerById(player.id);
            expect(result).toEqual(player);
        });
    });

    describe('Ensure a player', () => {
        it('Should create the player if it does not exist', async () => {
            const playerId = 'Alice';
            const player = { id: playerId } as Player;

            jest.spyOn(repository, 'findOne').mockResolvedValue(null);
            jest.spyOn(service, 'createPlayer').mockResolvedValue(player);

            const result = await service.ensurePlayer(playerId);

            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: playerId } });
            expect(service.createPlayer).toHaveBeenCalledWith({ id: playerId });
            expect(result).toEqual(player);
        });

        it('Should ensure the player in the ranking cache if player exists', async () => {
            const player = { id: 'Bob' } as Player;

            jest.spyOn(repository, 'findOne').mockResolvedValue(player);
            const cacheSpy = jest.spyOn(service['rankingCache'], 'ensurePlayer');

            const result = await service.ensurePlayer(player.id);

            expect(repository.findOne).toHaveBeenCalled();
            expect(cacheSpy).toHaveBeenCalledWith(player.id);
            expect(result).toEqual(player);
        });
    });

    describe("Update a player's rank", () => {
        it('Should update the rank of a player with the given id and new rank', async () => {
            const id = "Mina";
            const newRank = 8;

            // Mock de la méthode update
            const updateSpy = jest.spyOn(repository, "update").mockResolvedValue({} as any);

            // Appel du service
            await service.updateRank(id, newRank);

            // Vérifie que repository.update a été appelé avec les bons arguments
            expect(updateSpy).toHaveBeenCalledWith(id, { rank: newRank });
        });
    });

    describe('Delete player', () => {
        it('Should delete the player if it exists', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

            await expect(service.deletePlayer('Alice')).resolves.toBeUndefined();

            expect(repository.delete).toHaveBeenCalledWith('Alice');
        });

        it('Should throw NotFoundException if player does not exist', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

            await expect(service.deletePlayer('Unknown')).rejects.toThrow(NotFoundException);
        });
    });
});