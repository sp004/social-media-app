import { Helmet } from "react-helmet";

const Meta = ({title, name='description', content}) => {
  console.log("😏😏😏😏", title, name, content);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name={name} content={content} />
    </Helmet>
  );
};

export default Meta;