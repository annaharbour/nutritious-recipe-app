import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createRecipe } from '../../actions/recipe';

const initialState = {
    name: '',
    category: '',
    ingredients: [],
    isBowl: false,
    toppings: [],
}

const RecipeForm = ({createRecipe}) => {
  const [formData, setFormData] = useState(initialState);

  const { name, category, ingredients, isBowl, toppings } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

  // Handle checkbox separately
  if (type === 'checkbox') {
    setFormData({
      ...formData,
      [name]: checked, // Set isBowl to the checkbox value (true/false)
    });
  } else {
    setFormData({
      ...formData,
      [name]: value,
    });
  }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    createRecipe(formData)
      .then((success) => {
        if (success) {
          navigate('/dashboard'); // Redirect on success
        }
      });
  };
  


  return (
    <section className='container'>
        <h1 className='large text-primary'>Make a Smoothie</h1>
        <p className='lead'>Let's get started</p>
        <form className="form" onSubmit={onSubmit}>
        <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Recipe Name"
        />
        {/* Replace ingredients text input with mapping through of fruit, veg, protein, fat, superfoods from ingredients database like assignments by day in pony club app */}
        <input
            type="text"
            name="ingredients"
            value={ingredients}
            onChange={onChange}
            placeholder="Ingredients"
        />
        <label>
        <input
            type="checkbox"
            name="isBowl"
            value={isBowl}
            checked={isBowl}
            onChange={onChange}
        />
        Make a smoothie bowl
        </label>
        {/* Conditionally render the toppings field based on isBowl */}
        <br></br>
        {isBowl && (
            <label>
                <input
                type="text"
                name="toppings"
                value={toppings}
                onChange={onChange}
                placeholder='Toppings'
                />
            </label>
        )}
        <button type="submit" className='btn btn primary my-1'>Create Recipe</button>
        <Link className="btn btn-light my-1" to="/dashboard">
            Go Back
            </Link>
        </form>
    </section>
  );
};

RecipeForm.propTypes = {
    createRecipe: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    recipe: state.recipe
})

export default connect(mapStateToProps, {createRecipe})(RecipeForm);
