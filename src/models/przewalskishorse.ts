import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Кінь Пржевальського"
interface IPrzewalskishorse {
    name: string; // Ім'я Коня Пржевальського
    age: number; // Вік Коня Пржевальського у роках
    height: number; // Висота Коня Пржевальського в сантиметрах
    weight: number; // Вага Коня Пржевальського в кілограмах
    gender: 'male' | 'female'; // Стать Коня Пржевальського: 'male' - самець, 'female' - самка
    description?: string; // Опис Коня Пржевальського (необов'язкове поле)
    dateAdded: Date; // Дата додавання запису до бази даних
    eatenGrass: string; //кількість з'їденої трави за день, кг.
}

// Схема MongoDB для моделі "Кінь Пржевальського"
const przewalskishorseSchema = new Schema<IPrzewalskishorse>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
    eatenGrass: {
        type: String,
        required: true, // Поле є обов'язковим
    },
});

// Створення моделі Mongoose на основі схеми
export const Przewalskishorse = model<IPrzewalskishorse>(
    'Przewalskishorse',
    przewalskishorseSchema,
);
export type { IPrzewalskishorse }; // Експортуємо інтерфейс для використання в інших файлах
