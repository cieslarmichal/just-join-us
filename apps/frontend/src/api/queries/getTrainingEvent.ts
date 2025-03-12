import type { TrainingEvent } from '../types/trainingEvent';

export async function getTrainingEvent(id: string): Promise<TrainingEvent> {
  return {
    id,
    name: 'BLS - BASIC LIFE SUPPORT',
    description:
      'Szkolenie BLS to nie tylko wiedza teoretyczna o udzielaniu pierwszej pomocy – to przede wszystkim praktyczne umiejętności, które mogą uratować ludzkie życie w najtrudniejszych chwilach. Podczas tego kursu nauczysz się szybko i bezpiecznie ocenić stan poszkodowanego, udzielić pierwszej pomocy przy użyciu podstawowych środków z apteczki oraz skutecznie przeprowadzić resuscytację krążeniowo-oddechową (RKO). Dodatkowo zostaną omówione i przećwiczone procedury postępowania w przypadku masywnych krwotoków, ponieważ ich szybkie opanowanie jest kluczowe dla przeżycia poszkodowanego. Dowiesz się, jak poprawnie wezwać pomoc, zabezpieczyć miejsce zdarzenia i ocenić sytuację tak, aby nie narażać siebie ani innych na dodatkowe zagrożenia. Nauczysz się oceniać stan poszkodowanego (przytomność, oddech, krążenie), a także rozpoznawać oznaki masywnych krwotoków i udzielać natychmiastowej pomocy.',
    companyName: 'CCD Skills',
    companyLogoUrl: 'http://ccdskills.pl/wp-content/uploads/2023/10/CCD-Skills-logo-blk__rgb.png',
    category: 'Medycyna',
    startDate: new Date('2025-01-25:13:00:00Z'),
    location: 'Kraków',
    latitude: 49.835,
    longitude: 19.939,
    price: 350,
    duration: '8 godzin',
  };
}
