import React from "react";


function NotFound({ message }) {
	
	return (
		<section className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h1>404</h1>
					<p>{message || "Page Not Found"}</p>
					
				</div>
			</div>
		</section>
	);
}

export default NotFound;
