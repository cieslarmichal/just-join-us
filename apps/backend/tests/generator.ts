import { fakerPL as faker } from '@faker-js/faker';
import { v7 as uuidv7 } from 'uuid';

export class Generator {
  public static email(): string {
    return faker.internet.email().toLowerCase();
  }

  public static number(min = 0, max = 100, precision = 1): number {
    return faker.number.float({
      min,
      max,
      multipleOf: precision,
    });
  }

  public static string(length: number): string {
    return faker.string.sample(length);
  }

  public static alphaString(length: number, casing: 'lower' | 'upper' = 'lower'): string {
    return faker.string.alpha({
      casing,
      length,
    });
  }

  public static numericString(length: number): string {
    return faker.string.numeric({
      length,
    });
  }

  public static uuid(): string {
    return uuidv7();
  }

  public static arrayElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  public static firstName(): string {
    return faker.person.firstName();
  }

  public static lastName(): string {
    return faker.person.lastName();
  }

  public static companyName(): string {
    return faker.company.name();
  }

  public static trainingName(): string {
    return faker.lorem.words(3);
  }

  public static trainingDescription(): string {
    return faker.lorem.sentences(5);
  }

  public static city(): string {
    return faker.location.city();
  }

  public static place(): string {
    return faker.location.streetAddress();
  }

  public static latitude(): number {
    return faker.location.latitude();
  }

  public static longitude(): number {
    return faker.location.longitude();
  }

  public static centPrice(): number {
    return Generator.number(10000, 100000);
  }

  public static categoryName(): string {
    const categories = ['Strzelectwo', 'Medycyna', 'Cyberbezpieczeństwo', 'Samoobrona', 'Drony', 'Prawo', 'Survival'];

    const uniqueCategoryName = faker.helpers.arrayElement(categories) + faker.number.int({ min: 1, max: 9 }).toString();

    return uniqueCategoryName;
  }

  public static taxId(): string {
    return faker.string.numeric(10);
  }

  public static phone(): string {
    return faker.phone.number({ style: 'international' });
  }

  public static word(): string {
    return faker.lorem.word();
  }

  public static boolean(): boolean {
    return faker.datatype.boolean();
  }

  public static password(): string {
    let password = faker.internet.password({
      length: 13,
    });

    password += Generator.alphaString(1, 'upper');

    password += Generator.alphaString(1, 'lower');

    password += Generator.numericString(1);

    return password;
  }

  public static sentences(count = 3): string {
    return faker.lorem.sentences(count);
  }

  public static words(count = 3): string {
    return faker.lorem.words(count);
  }

  public static futureDate(): Date {
    return faker.date.future();
  }

  public static soonDate(refDate: Date): Date {
    return faker.date.soon({
      days: 3,
      refDate,
    });
  }

  public static pastDate(): Date {
    return faker.date.past();
  }

  public static birthDate(): Date {
    return faker.date.between({
      from: '1970-01-01',
      to: '2006-01-01',
    });
  }

  public static imageUrl(width = 200, height = 120): string {
    return faker.image.url({
      width,
      height,
    });
  }
}
