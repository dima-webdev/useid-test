import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';

// Imagine you have a list of languages that you'd like to autosuggest.
const countries = [
  {
    name: 'Russia',
  },
  {
    name: 'Finland',
  },
];

const citiesRu = [
  { name: 'Saint Petersburg' },
  { name: 'Moscow' },
  { name: 'Novosibirsk' }
];

const citiesFi = [
  { name: 'Helsinki' },
  { name: 'Kotka' },
  { name: 'Hameenlinna' }
];

const cities = [
  { name: 'Saint Petersburg' },
  { name: 'Moscow' },
  { name: 'Novosibirsk' }
];

const citiesByCountry = {
  '': [],
  Russia: citiesRu,
  Finland: citiesFi,
}

// TODO: AJAX
const getCountrySuggestions = value => {
  const val = value.trim().toLowerCase();
  const len = val.length;

  return len === 0 ? [] : countries.filter(c => c.name.toLowerCase().slice(0, len) === val);
};

const getCitySuggestions = country => value => {
  const val = value.trim().toLowerCase();
  const len = val.length;

  return len === 0 ? [] : citiesByCountry[country] ? citiesByCountry[country].filter(c => c.name.toLowerCase().slice(0, len) === val) : [];
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField fullWidth InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 250,
    flexGrow: 1,
    width: 420,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

export default function CitySelect() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [state, setState] = React.useState({
    country: 'Russia',
    city: '',
    cities: [],
  });

  const [citySuggestions, setCitySuggestions] = React.useState([]);
  const [countrySuggestions, setCountrySuggestions] = React.useState([]);
  const handleChange = name => (event, { newValue }) => {
    setState({
      ...state,
      [name]: newValue,
    });
  };

  const isCity = (val) => {
    console.log(citiesByCountry)
    return citiesByCountry[state.country] && citiesByCountry[state.country].filter(c => c.name === val).length > 0;
  }
  const handleCityChange = (event, { newValue }) => {
    setState({
      ...state,
      city: newValue,
      cities: isCity(newValue) && ! state.cities.includes(newValue) ? state.cities.concat(newValue) : state.cities
    });
  };

  const isCountry = (val) => {
    return countries.find((c) => c.name === val);
  }

  const handleCountryChange = (event, { newValue }) => {
    setState({
      ...state,
      country: newValue,
      city: isCountry(newValue) ? '' : state.city,
    });
  };

  const handleCitySuggestionsFetchRequested = ({ value }) => {
    setCitySuggestions(getCitySuggestions(state.country)(value));
  };

  const handleCitySuggestionsClearRequested = () => {
    setCitySuggestions([]);
  };

  const handleCountrySuggestionsFetchRequested = ({ value }) => {
    setCountrySuggestions(getCountrySuggestions(value));
  };

  const handleCountrySuggestionsClearRequested = () => {
    setCountrySuggestions([]);
  };

  const handleCityDelete = (val) => () => {
    setState({
      ...state,
      cities: state.cities.filter(c => c !== val)
    });
  }

  const autosuggestCountryProps = {
    renderInputComponent,
    suggestions: countrySuggestions,
    onSuggestionsFetchRequested: handleCountrySuggestionsFetchRequested,
    onSuggestionsClearRequested: handleCountrySuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  };
  const autosuggestCityProps = {
    renderInputComponent,
    suggestions: citySuggestions,
    onSuggestionsFetchRequested: handleCitySuggestionsFetchRequested,
    onSuggestionsClearRequested: handleCitySuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        {...autosuggestCountryProps}
        inputProps={{
          classes,
          id: 'search-c',
          label: 'Search Country',
          placeholder: 'Search a country',
          value: state.country,
          onChange: handleCountryChange,
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
      <div className={classes.divider} />
      <Autosuggest
        {...autosuggestCityProps}
        inputProps={{
          classes,
          id: 'search-cc',
          label: 'Search city',
          placeholder: 'Search City',
          value: state.city,
          onChange: handleCityChange,
          inputRef: node => {
            setAnchorEl(node);
          },
          InputLabelProps: {
            shrink: true,
          },
        }}
        theme={{
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Popper anchorEl={anchorEl} open={Boolean(options.children)}>
            <Paper
              square
              {...options.containerProps}
              style={{ width: anchorEl ? anchorEl.clientWidth : undefined }}
            >
              {options.children}
            </Paper>
          </Popper>
        )}
      />
      <div>
        {state.cities.map(c => <Chip
          key={c}
          label={c}
          onDelete={handleCityDelete(c)}
          className={classes.chip}
          color="primary"
          variant="outlined"
          />
        )}
      </div>
    </div>
  );
}
