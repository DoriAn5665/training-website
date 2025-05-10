import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { PrzewalskishorseRepository } from '../repositories/PrzewalskishorseRepository';

// Створюємо новий обробник HTTP-запитів Express
const router = Router();
// Отримуємо екземпляр репозиторію Коней Пржевальського з контейнера інверсії залежностей
const przewalskishorseRepository = container.get(PrzewalskishorseRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів Коней Пржевальського
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи Коней Пржевальського з бази даних через репозиторій
        const przewalskishorses = await przewalskishorseRepository.findAll();
        res.json(przewalskishorses);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису одного Коня Пржевальського за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук Коня Пржевальського за ідентифікатором
        const przewalskishorse = await przewalskishorseRepository.findById(req.params.id);
        if (przewalskishorse) {
            res.json(przewalskishorse);
        } else {
            // Якщо Кінь Пржевальського не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис Коня Пржевальського не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису Коня Пржевальського
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис Коня Пржевальського з даних запиту
        const newPrzewalskishorse = await przewalskishorseRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного Коня Пржевальського
        res.status(201).json(newPrzewalskishorse);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису Коня Пржевальського
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо Коня Пржевальського з вказаним ID
        const przewalskishorse = await przewalskishorseRepository.update(req.params.id, req.body);
        if (przewalskishorse) {
            return res.json(przewalskishorse);
        } else {
            // Якщо Кінь Пржевальського не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис Коня Пржевальського не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису Коня Пржевальського
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису Коня Пржевальського - передаються лише ті поля, які потрібно змінити
        const przewalskishorse = await przewalskishorseRepository.patch(req.params.id, req.body);
        if (przewalskishorse) {
            res.json(przewalskishorse);
        } else {
            // Якщо Кінь Пржевальського не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис Коня Пржевальського не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису Коня Пржевальського
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про Коня Пржевальського за ID
        const przewalskishorse = await przewalskishorseRepository.delete(req.params.id);
        if (przewalskishorse) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про Коня Пржевальського видалено' });
        } else {
            // Якщо Кінь Пржевальського не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про Коня Пржевальського не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
