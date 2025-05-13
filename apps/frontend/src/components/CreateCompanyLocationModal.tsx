import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext.tsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog.tsx';
import { Button } from './ui/Button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/Form.tsx';
import { useDebounce } from '../hooks/useDebounce.ts';
import { City } from '../api/types/city.ts';
import { getCities } from '../api/queries/getCities.ts';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { Input } from './ui/Input.tsx';
import { CiLocationOn } from 'react-icons/ci';
import MapPicker from './MapPicker.tsx';
import { z } from 'zod';
import { createCompanyLocation } from '../api/queries/createCompanyLocation.ts';

const formSchema = z.object({
  name: z.string().min(3).max(50),
  cityId: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  companyId: string;
  onSuccess: () => void;
}

export const CreateCompanyLocationModal = ({ companyId, onSuccess }: Props): ReactNode => {
  const { userData, accessToken } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityId: '',
      latitude: 0,
      longitude: 0,
      address: '',
      name: '',
    },
    mode: 'onTouched',
  });

  const [cityInput, setCityInput] = useState('');
  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
  const debouncedCityInput = useDebounce(cityInput, 500);
  const [suggestionSelected, setSuggestionSelected] = useState<boolean>(cityInput !== '');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const fetchSuggestedCities = useCallback(async () => {
    if (debouncedCityInput === '' || cityInput === '') {
      setSuggestedCities([]);
      return;
    }

    try {
      const results = await getCities(debouncedCityInput);
      setSuggestedCities(results);
    } catch (error) {
      console.error('Failed to fetch cities', error);
    }
  }, [debouncedCityInput, cityInput]);

  useEffect(() => {
    if (suggestionSelected) {
      return;
    }

    fetchSuggestedCities();
  }, [debouncedCityInput, suggestionSelected, fetchSuggestedCities]);

  const handleCitySuggestionClick = (city: City) => {
    setCityInput(city.name);
    form.setValue('latitude', city.latitude, { shouldValidate: true });
    form.setValue('longitude', city.longitude, { shouldValidate: true });
    form.setValue('cityId', city.id, { shouldValidate: true });
    setSuggestionsOpen(false);
    setSuggestedCities([]);
    setSuggestionSelected(true);
  };

  const onSubmit = async (payload: FormValues): Promise<void> => {
    if (!userData || !accessToken) {
      setError('Cannot create location without user data or access token');
      return;
    }

    try {
      await createCompanyLocation({
        companyId,
        cityId: payload.cityId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        name: payload.name,
        accessToken,
      });

      toast.success('Company location created.');

      onSuccess();

      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        return setError(error.message);
      }

      throw error;
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        setIsOpen(val);

        form.reset();

        setCityInput('');
        setSuggestedCities([]);
        setSuggestionSelected(false);
        setSuggestionsOpen(false);

        form.clearErrors();

        setError('');
      }}
    >
      <DialogTrigger asChild>
        <Button className="px-3 sm:px-6 rounded-lg whitespace-nowrap bg-pink-600 py-5 font-medium">
          Create location
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          borderRadius: '30px',
        }}
        className="sm:max-w-2xl py-8"
      >
        <DialogHeader className="font-semibold text-center flex justify-center items-center mb-4">
          <DialogTitle>Create location</DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col gap-4 justify-center items-center">
          <p className={error ? 'text-red-500' : 'hidden'}>{error}</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-140"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Location name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Location address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cityId"
                render={() => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="City"
                          value={cityInput}
                          onChange={(event) => {
                            setCityInput(event.target.value);
                            setSuggestionSelected(false);
                          }}
                          className="pl-4 h-13 w-full"
                          onBlur={() => {
                            setTimeout(() => {
                              setSuggestionsOpen(false);
                            }, 200);
                          }}
                          onFocus={() => {
                            setSuggestionsOpen(true);
                          }}
                        />
                        {cityInput.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCityInput('');
                              setSuggestedCities([]);
                              setSuggestionSelected(false);
                              setSuggestionsOpen(false);
                              form.setValue('cityId', '', { shouldValidate: true });
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          >
                            <IoCloseCircleOutline className="w-6 h-6 text-gray-800 hover:text-gray-900" />
                          </button>
                        )}
                        {suggestionsOpen && suggestedCities.length > 0 && (
                          <div className="absolute z-10 w-full max-h-70 mt-1 overflow-y-auto bg-white shadow-md border border-gray-300 p-2 rounded-xl">
                            <ul>
                              {suggestedCities.map((city) => (
                                <li
                                  key={city.id}
                                  className="p-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    handleCitySuggestionClick(city);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <CiLocationOn className="mr-1 w-5 h-5" />
                                    <div className="text-sm">
                                      {city.name}, {city.province}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <FormLabel>Coordinates</FormLabel>
                <MapPicker
                  latitude={form.watch('latitude')}
                  longitude={form.watch('longitude')}
                  className="w-full h-50 md:h-70"
                  readOnly={false}
                />
              </div>

              <div className="pt-8 gap-2 flex sm:justify-center justify-center sm:items-center items-center">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="bg-pink-600 w-full disabled:bg-gray-400 text-black enabled:text-white py-5"
                >
                  Create
                </Button>
              </div>
            </form>
          </Form>
          {form.formState.errors.root && (
            <div className="text-red-600 text-sm mt-2">{form.formState.errors.root.message}</div>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
