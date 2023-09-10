import axios from "axios";

export function getAssignments() {
    return axios.get('/api/ingredients').then(({data: {ingredients: allIngredients}}) => {
      /* We need to transform the response from the server so that it's simpler to render
       * We're going to take the array returned from the server and make an object out of it.
       * It's structure will look something like...
       * {
       *   'friday AM': [assignment objects],
       *   'friday PM': [assignment objects],
       *   'saturday PM': [assignment objects],
       *   ...
       * }
       */
      const ingredientsByCategory = allIngredients.reduce((acc, a) => {
        // These first two constants will be concatenated to create our unique object key
        const {category} = a;
        // Uppercase am/pm to it displays better to the user, i.e. friday AM
        // Note: friday will be capitalized in CSS via text-transform: 'capitalize'
        // const ampm = a.ampm.toUpperCase();

        // create a unique key based on the day and time of day
        const key = `${name}`;

        // Find the key, if it isn't found, create it and set it to an empty array
        acc[key] ||= [];
        // append the assignment to this key in the object
        acc[key].push(a);

        // the above lines can be simplified in one line to the this...
        //acc[key] = [...(acc[key] || []), a];

        // return the accumulator, this is the object that we are building and that will eventually be
        // returned by `reduce` and set to assignmentsByJob
        return acc;
      }, {});

      return ingredientsByCategory;
    });
  }