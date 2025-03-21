import { IoIosArrowDown } from 'react-icons/io';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';
import { RadioGroup, RadioGroupItem } from './ui/RadioGroup';
import { Label } from './ui/Label';

export default function SortButton() {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 rounded-3xl px-4 py-2">
          <span>Sort</span>
          <IoIosArrowDown className="w-5 h-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option-one"
              id="option-one"
            />
            <Label htmlFor="option-one">Option One</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option-two"
              id="option-two"
            />
            <Label htmlFor="option-two">Option Two</Label>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
