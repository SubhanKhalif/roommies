import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormHelperText, FormControl } from '@mui/material';
import { SearchOutlined, ClearOutlined } from '@mui/icons-material';

const SearchBar = ({ onChange, searchHandler }) => {
  return (
    <div className='h-[10%] w-[100%] flex box-border justify-center py-2 relative'>
      <FormControl sx={{ m: 1, width: '60%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
        <OutlinedInput
          onChange={onChange}
          id="outlined-adornment-password"
          type='text'
          spellCheck={false}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={searchHandler}>
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          }
          label="Search"
        />
      </FormControl>
    </div>
  );
};

export default SearchBar;
