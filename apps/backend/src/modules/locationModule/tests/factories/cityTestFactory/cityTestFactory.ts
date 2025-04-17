import { Generator } from '../../../../../../tests/generator.ts';
import type { CityRawEntity } from '../../../../databaseModule/infrastructure/tables/citiesTable/cityRawEntity.ts';
import { type CityDraft, City } from '../../../domain/entities/city/city.ts';

export class CityTestFactory {
  public create(input: Partial<CityDraft> = {}): City {
    const name = Generator.city();
    const province = Generator.province();
    const slug = this.createSlug(name, province);

    return new City({
      id: Generator.uuid(),
      name,
      slug,
      province,
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      ...input,
    });
  }

  public createRaw(input: Partial<CityRawEntity> = {}): CityRawEntity {
    const name = Generator.city();
    const province = Generator.province();
    const slug = this.createSlug(name, province);

    return {
      id: Generator.uuid(),
      name,
      slug,
      province,
      latitude: Generator.latitude(),
      longitude: Generator.longitude(),
      ...input,
    };
  }

  private createSlug(city: string, province: string): string {
    const polishCharactersMapping: Record<string, string> = {
      ą: 'a',
      ć: 'c',
      ę: 'e',
      ł: 'l',
      ń: 'n',
      ó: 'o',
      ś: 's',
      ź: 'z',
      ż: 'z',
    };

    const slug = `${city} ${province}`
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[ąćęłńóśźż]/g, (char) => polishCharactersMapping[char] || char);

    return slug;
  }
}
