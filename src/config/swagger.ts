// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Коней Пржевальського',
        version: '1.0.0',
        description: 'Документація API для Сайту про Коней Пржевальського',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення кінцевих точок (endpoints) REST API та операцій з ними
    paths: {
        '/api/przewalskishorse': {
            // GET запит для отримання всіх Коней Пржевальського
            get: {
                summary: 'Отримати всіх Коней Пржевальського',
                responses: {
                    '200': {
                        description: 'Список всіх Коней Пржевальського',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Przewalskishorse' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового Коня Пржевальського
            post: {
                summary: 'Створити нового Коня Пржевальського',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Przewalskishorse' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт Коня Пржевальського",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Przewalskishorse' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного Коня Пржевальського за ID
        '/api/przewalskishorses/{id}': {
            // GET запит для отримання Коня Пржевальського за ID
            get: {
                summary: 'Отримати Коня Пржевальського за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Коня Пржевальського',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт Коня Пржевальського",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Przewalskishorse' },
                            },
                        },
                    },
                    '404': { description: 'Коня Пржевальського не знайдено' },
                },
            },

            // PUT запит для повного оновлення Коня Пржевальського за ID
            put: {
                summary: 'Повністю оновити Коня Пржевальського',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Коня Пржевальського',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Przewalskishorse' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт Коня Пржевальського",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Przewalskishorse' },
                            },
                        },
                    },
                    '404': { description: 'Коня Пржевальського не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення Коня Пржевальського за ID
            patch: {
                summary: 'Частково оновити Коня Пржевальського',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Коня Пржевальського',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Przewalskishorse' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт Коня Пржевальського",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Przewalskishorse' },
                            },
                        },
                    },
                    '404': { description: 'Коня Пржевальського не знайдено' },
                },
            },
            // DELETE запит для видалення даних про Коня Пржевальського за ID
            delete: {
                summary: 'Видалити дані про Коня Пржевальського',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID Коня Пржевальського',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Коня Пржевальського не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Заєць
            Przewalskishorse: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я Коня Пржевальського",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік Коня Пржевальського у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота Коня Пржевальського в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага Коня Пржевальського в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать Коня Пржевальського',
                    },
                    description: {
                        type: 'string',
                        description: "Опис Коня Пржевальського  (необов'язкове поле)",
                    },
                    eatenGrass: {
                        type: 'string',
                        eatenGrass: 'Кількість з`їденої трави за день, кг.',
                    },
                },
            },
        },
    },
};
