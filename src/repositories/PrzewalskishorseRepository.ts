import { injectable } from 'inversify';
import { Przewalskishorse, IPrzewalskishorse } from '../models/przewalskishorse';

// Клас-репозиторій для роботи з Кіньми Пржевальського
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class PrzewalskishorseRepository {
    // Метод для отримання всіх Коней Пржевальського з бази даних
    public async findAll(): Promise<IPrzewalskishorse[]> {
        return Przewalskishorse.find();
    }

    // Метод для пошуку Коня Пржевальського за унікальним ідентифікатором
    public async findById(id: string): Promise<IPrzewalskishorse | null> {
        return Przewalskishorse.findById(id);
    }

    // Метод для створення нового Коня Пржевальського в базі даних
    public async create(przewalskishorseData: IPrzewalskishorse): Promise<IPrzewalskishorse> {
        const przewalskishorse = new Przewalskishorse(przewalskishorseData);
        return przewalskishorse.save();
    }

    // Метод для видалення Коня Пржевальського за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Przewalskishorse.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про Коня Пржевальського (заміна всіх полів)
    public async update(
        id: string,
        przewalskishorseData: IPrzewalskishorse,
    ): Promise<IPrzewalskishorse | null> {
        return Przewalskishorse.findByIdAndUpdate(id, przewalskishorseData, { new: true });
    }

    // Метод для часткового оновлення даних про Коня Пржевальського (оновлення лише вказаних полів)
    public async patch(
        id: string,
        przewalskishorseData: Partial<IPrzewalskishorse>,
    ): Promise<IPrzewalskishorse | null> {
        return Przewalskishorse.findByIdAndUpdate(
            id,
            { $set: przewalskishorseData },
            { new: true },
        );
    }
}
