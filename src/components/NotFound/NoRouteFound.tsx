const NoRouteFound = () => {
  const containerStyle: any = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", // Take full viewport height
    backgroundColor: "#f8f9fa", // Light gray background
    color: "#343a40", // Dark gray text
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  };

  const headingStyle = {
    fontSize: "3em", // Larger font size for emphasis
    marginBottom: "20px",
    color: "#dc3545", // Red color for error indication
  };

  const paragraphStyle = {
    fontSize: "1.2em",
    marginBottom: "30px",
  };

  const linkStyle = {
    fontSize: "1em",
    color: "#007bff", // Blue for links
    textDecoration: "none",
    border: "1px solid #007bff",
    padding: "10px 20px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const linkHoverStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404 - Not Found 😟</h1>
      <p style={paragraphStyle}>
        Oops! The page you are looking for doesn't exist.
      </p>
      <a
        href="/"
        style={linkStyle}
        onMouseOver={(e: any) => Object.assign(e.target.style, linkHoverStyle)}
        onMouseOut={(e: any) => Object.assign(e.target.style, linkStyle)}
      >
        Go to Homepage
      </a>
    </div>
  );
};

export default NoRouteFound;
