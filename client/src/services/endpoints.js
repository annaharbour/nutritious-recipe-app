const PORT = 5000;
const baseURL = `http://localhost:${PORT}`;
const authURL = `${baseURL}/auth`;
const usersUrl = `${baseURL}/users`;
const profileUrl = `${baseURL}/profile`;
const commentsUrl = `${baseURL}/comments`;
const recipesUrl = `${baseURL}/recipes`;
const ingredientsUrl = `${baseURL}/ingredients`;
const nutrientsUrl = `${baseURL}/nutrients`
module.exports  = {
	baseURL,
	authURL,
	usersUrl,
	profileUrl,
	commentsUrl,
	recipesUrl,
	ingredientsUrl,
	nutrientsUrl
};
