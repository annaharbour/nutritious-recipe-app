import React, {useEffect, useState} from "react";
import { getProfileById } from "../../services/profileService";
import { useParams } from "react-router";
import NotFound from "../layout/NotFound";
import { getRecipesByUserId } from "../../services/recipeService";
import { getUserById } from "../../services/userService";
import { getUserRatings } from "../../services/ratingService";

function ProfileView() {
    const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [ratedRecipes, setRatedRecipes] = useState([]);
	const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await getUserById(id);
                setUser(res);
                if (res) {
                    setProfile(res);
                    setLoading(false);
                } else {
                    setError("Profile not found.");
                    setLoading(false);
                }
            } catch (error) {
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        }
                
        const fetchUserRecipes = async () => {
            try {
                setLoading(true);
                const res = await getRecipesByUserId(id);
                if (res) {
                    setRecipes(res.data);
                } else {
                    setError("Profile not found.");
                }
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        }

            
    const fetchUserRatings = async () => {
        try {
            setLoading(true);
            const res = await getUserRatings(id);
            if (res) {
                setRatedRecipes(res.userRatings);
            } else {
                setError("Profile not found.");
            }
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch data. Please try again later.");
            setLoading(false);
        }
    }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const profileData = await getProfileById(id);
                if (profileData) {
                    setProfile(profileData);
                } else {
                    setError("Profile not found");
                }
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
                setLoading(false);
            }
        }
        fetchUser();
        fetchUserRecipes();
        fetchProfile();
        fetchUserRatings();
        
    }, [id]);  

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <NotFound message={error} />;
    }

    if (!profile) {
        return <NotFound message="Profile not found." />;
    }
	
    const date = new Date().getTime()
    const createdAtDate = new Date(user.createdAt).getTime()
    const dateDiff = date - createdAtDate
    const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24))

    return (
    <div>
        <h1>{user.name}</h1> 
        {days ? <i>Joined {days} days ago</i> : <></>}
        <p>{profile.bio}</p>   
        <h2>{user.name}'s Recipes</h2>
        <ul>
            {recipes.map((recipe) => (
                <li key={recipe._id}>
                 <a href={`/recipes/${recipe._id}`}>{recipe.name}</a>
                </li>
            ))}
        </ul>
        <h2>Rated Recipes</h2>
        {ratedRecipes.map((recipe) => (
                <li key={recipe.recipeId}>
                 {user.name} gave <a href={`/recipes/${recipe._id}`}>{recipe.recipeName}</a> {recipe.stars} stars on {new Date(recipe.createdAt).toLocaleDateString()}
                </li>
            ))}
        
    </div>);
}

export default ProfileView;
