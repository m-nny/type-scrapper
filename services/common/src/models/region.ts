import { RegionInfo } from './student';

export const REGIONS: RegionInfo[] = [
    { id: 1, label: 'г. Алматы' },
    { id: 2, label: 'г. Нур-Султан' },
    { id: 3, label: 'г. Шымкент' },
    { id: 4, label: 'Акмолинская' },
    { id: 5, label: 'Актюбинская' },
    { id: 6, label: 'Алматинская' },
    { id: 7, label: 'Атырауская' },
    { id: 8, label: 'Восточно-Казахстанская' },
    { id: 9, label: 'Жамбылская' },
    { id: 10, label: 'Западно-Казахстанская' },
    { id: 11, label: 'Карагандинская' },
    { id: 12, label: 'Костанайская' },
    { id: 13, label: 'Кызылординская' },
    { id: 14, label: 'Мангыстауская' },
    { id: 15, label: 'Павлодарская' },
    { id: 16, label: 'Северо-Казахстанская' },
    { id: 17, label: 'Туркестанская' },
];

export const getRegionByLabel = (regionName: string): RegionInfo | undefined =>
    REGIONS.find(({ label }) => label.toLocaleLowerCase() === regionName.toLocaleLowerCase());

export const getRegionByLabelOrThrow = (regionName: string): RegionInfo => {
    const region = REGIONS.find(({ label }) => label.toLocaleLowerCase() === regionName.toLocaleLowerCase());
    if (!region) {
        throw new Error(`There is no region with name: ${regionName}`);
    }
    return region;
};
