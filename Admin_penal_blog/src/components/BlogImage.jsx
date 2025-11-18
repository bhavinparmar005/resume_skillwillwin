import React from "react";
import { Card } from "react-bootstrap";

// Memoized image component to prevent unnecessary re-renders
const BlogImage = React.memo(({ url, alt, style }) => {
    return <Card.Img variant="top" src={url} alt={alt} loading="lazy" style={style} />;
});

export default BlogImage;