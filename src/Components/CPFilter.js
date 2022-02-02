import { createFilterOptions } from '@mui/material/Autocomplete';

// Function that handle client and project filtering
function CPFilter(options, params) {
  // Creates a filter function
  const filter = createFilterOptions();
  // Creates a array of filtered options based on the input
  const filtered = filter(options, params);

  // Extracts the string input value from params
  const { inputValue } = params;
  // If the input value is not empty
  if (inputValue !== '' && !filtered.some((CP) => CP.name === inputValue)) {
    // Add a create new client option
    filtered.push({
      // Sets the name key to the 'ADD CLIENT: ' + input value
      name: `ADD CLIENT: ${inputValue}`,
      // Sets the newValue key's value to true
      newValue: true,
      // Sets the type to clients for grouping
      type: 'clients',
    });
    // Add a create new project option
    filtered.push({
      // Sets the name key to the 'ADD PROJECT: ' + input value
      name: `ADD PROJECT: ${inputValue}`,
      // Sets the newValue key's value to true
      newValue: true,
      // Sets the type to projects for grouping
      type: 'projects',
    });
  }

  // Returns the filtered options array
  return filtered;
}

export default CPFilter;