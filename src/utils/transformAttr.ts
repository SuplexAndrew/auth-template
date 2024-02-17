import { Op } from 'sequelize';

function toSequelizeRangeSearchQuery(v) {
  if (Array.isArray(v))
    return {
      [Op.or]: [
        ...[v.filter((k) => k !== null)],
        ...(v.includes(null) ? [{ [Op.is]: null }] : []),
      ],
    };
  if (typeof v !== 'object' || v === null) return v;

  const { gte, lte } = v;

  const checkLte = lte !== null && lte !== undefined;
  const checkGte = gte !== null && gte !== undefined;

  if (checkGte && checkLte) return { [Op.between]: [gte, lte] };

  if (checkGte) return { [Op.gte]: gte };
  if (checkLte) return { [Op.lte]: lte };
  return v;
}

export function transformAttr(filter) {
  return Object.entries(filter).reduce(
    (acc, [key, value]) => ({
      [key]: toSequelizeRangeSearchQuery(value),
      ...acc,
    }),
    {},
  );
}
