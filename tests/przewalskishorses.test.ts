import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Przewalskishorse } from '../src/models/przewalskishorse';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про Коней Пржевальського
describe('API вебдодатку сайту про Коней Пржевальського', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/przewalskishorses-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "przewalskishorses-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію Коней Пржевальського
    beforeEach(async () => {
        await Przewalskishorse.deleteMany({});
    });

    // Тести для створення запису про нового Коня Пржевальського (POST-запит)
    describe('POST /api/przewalskishorses', () => {
        it('має створити запис про нового Коня Пржевальського', done => {
            // Тестові дані Коня Пржевальського
            const przewalskishorse = {
                name: 'Вухань',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Сірий Кінь Пржевальського',
            };

            // Виконуємо POST-запит для створення запису про Коня Пржевальського
            chai.request(app)
                .post('/api/przewalskishorses')
                .send(przewalskishorse)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', przewalskishorse.name);
                    expect(res.body).to.have.property('age', przewalskishorse.age);
                    expect(res.body).to.have.property('height', przewalskishorse.height);
                    expect(res.body).to.have.property('weight', przewalskishorse.weight);
                    expect(res.body).to.have.property('gender', przewalskishorse.gender);
                    expect(res.body).to.have.property('description', przewalskishorse.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів Коней Пржевальського (GET-запит)
    describe('GET /api/przewalskishorses', () => {
        it('має отримати всіх Коней Пржевальського', async () => {
            // Створюємо тестовий запис Коня Пржевальського
            const testPrzewalskishorse = new Przewalskishorse({
                name: 'Білан',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Білий Кінь Пржевальського',
            });
            await testPrzewalskishorse.save();

            // Виконуємо GET-запит для отримання всіх записів Коней Пржевальського
            const res = await chai.request(app).get('/api/przewalskishorses');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Білан');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Білий Кінь Пржевальського');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретного Конь Пржевальського за ID (GET-запит)
    describe('GET /api/przewalskishorses/:id', () => {
        it('має отримати конкретного Коня Пржевальського за id', async () => {
            // Створюємо запис тестового Коня Пржевальського
            const testPrzewalskishorse = new Przewalskishorse({
                name: 'Косий',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Коричневий Кінь Пржевальського',
            });
            const savedPrzewalskishorse = await testPrzewalskishorse.save();

            // Виконуємо GET-запит для отримання запису Коня Пржевальського за ID
            const res = await chai
                .request(app)
                .get(`/api/przewalskishorses/${String(savedPrzewalskishorse._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Косий');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричневий Кінь Пржевальського');
        });

        it('має повернути 404 для неіснуючого Коня Пржевальського', async () => {
            // Виконуємо GET-запит для неіснуючого ID Коня Пржевальського
            const res = await chai
                .request(app)
                .get('/api/przewalskishorses/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про Коня Пржевальського (PUT-запит)
    describe('PUT /api/przewalskishorses/:id', () => {
        it('має повністю оновити запис про Коня Пржевальського', async () => {
            // Створюємо тестового Коня Пржевальського
            const testPrzewalskishorse = new Przewalskishorse({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedPrzewalskishorse = await testPrzewalskishorse.save();

            // Дані для оновлення Коня Пржевальського
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит для повного оновлення запису про Коня Пржевальського
            const res = await chai
                .request(app)
                .put(`/api/przewalskishorses/${String(savedPrzewalskishorse._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового Коня Пржевальського
            const testPrzewalskishorse = new Przewalskishorse({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedPrzewalskishorse = await testPrzewalskishorse.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/przewalskishorses/${String(savedPrzewalskishorse._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що Кінь Пржевальського не змінився
            const unchangedPrzewalskishorse = await Przewalskishorse.findById(
                savedPrzewalskishorse._id,
            );
            expect(unchangedPrzewalskishorse).to.have.property('name', 'Оригінальний');
            expect(unchangedPrzewalskishorse).to.have.property('height', 25);
            expect(unchangedPrzewalskishorse).to.have.property('weight', 1.8);
        });
    });

    // Тести для часткового оновлення запису про Коня Пржевальського (PATCH-запит)
    describe('PATCH /api/przewalskishorses/:id', () => {
        it('має частково оновити запис про Коня Пржевальського', async () => {
            // Створюємо тестового Коня Пржевальського
            const testPrzewalskishorse = new Przewalskishorse({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedPrzewalskishorse = await testPrzewalskishorse.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/przewalskishorses/${String(savedPrzewalskishorse._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового Коня Пржевальського
            const testPrzewalskishorse = new Przewalskishorse({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
            });
            const savedPrzewalskishorse = await testPrzewalskishorse.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/przewalskishorses/${String(savedPrzewalskishorse._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/przewalskishorses', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/przewalskishorses')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису Коня Пржевальського (DELETE-запит)
    describe('DELETE /api/przewalskishorses/:id', () => {
        it('має видалити запис про Коня Пржевальського', async () => {
            // Створюємо тестового Коня Пржевальського
            const testPrzewalskishorse = new Przewalskishorse({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорний Кінь Пржевальського',
            });
            const savedPrzewalskishorse = await testPrzewalskishorse.save();

            // Виконуємо DELETE-запит
            const res = await chai
                .request(app)
                .delete(`/api/przewalskishorses/${String(savedPrzewalskishorse._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про Коня Пржевальського видалено');

            // Перевіряємо, що запис про Коня Пржевальського дійсно видалено з бази
            const findPrzewalskishorse = await Przewalskishorse.findById(savedPrzewalskishorse._id);
            expect(findPrzewalskishorse).to.be.null;
        });
    });
});
