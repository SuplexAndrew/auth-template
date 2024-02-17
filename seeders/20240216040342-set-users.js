'use strict';
const { genSalt, hash } = require('bcryptjs');

const data = [
  {
    name: 'Alex',
    email: 'alex@mail.com',
    phone: '+79048321919',
    birthDate: '2000-10-10',
    height: 180,
    weight: 78,
  },
  {
    name: 'Michele',
    email: 'michelleX@mail.com',
    phone: '+79048321212',
    birthDate: '1989-12-10',
    height: 172,
    weight: 52,
  },
  {
    name: 'Martha',
    email: 'martha0312@mail.com',
    phone: '+79048320303',
    birthDate: '2001-03-12',
    height: 159,
    weight: 52,
  },
  {
    name: 'Arthur',
    email: 'arthurik-100@gmail.com',
    phone: '+79918321919',
    birthDate: '1999-01-20',
    height: 190,
    weight: 81,
  },
  {
    name: 'Petya',
    email: 'petr1@yahoo.com',
    phone: '+79001231678',
    birthDate: '2002-11-30',
    height: 167,
    weight: 80,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = await Promise.all(
      data.map(async (info) => {
        const salt = await genSalt(8);

        const hashPass = await hash('123456', salt);

        return {
          password: hashPass,
          salt,
          ...info,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    );

    return queryInterface.bulkInsert('Users', users);
  },

  down(queryInterface) {
    return 1;
  },
};
