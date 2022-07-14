import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";

const Image = () => {
  const [file, setFile] = useState("");

  const onChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    axios.post("http://localhost:3001/posts/img", formData).then((response) => {
      console.log(response);
    });
  };

  return (
    <div className="containerPost">
      <Formik>
        <Form className="formContainer" onSubmit={onSubmit}>
          <Field
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
            required
          />

          <button type="submit">Upload</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Image;

// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";

// function Image() {
//   const [image, setImage] = useState();

//   const img = (e) => {
//     let file = e.target.files[0];
//     console.log(file);
//     let reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (e) => {
//       setImage(e.target.result);
//     };
//   };

//   return (
//     <div className="containerPost">
//       {/* <form>
//         <input type="file" onChange={img} />
//       </form>
//       <img width="300px" src={image} alt="" /> */}
//       <Formik>
//         <Form className="formContainer">
//           <label>Img: </label>
//           <ErrorMessage name="image" component="span" />
//           <Field
//             autoComplete="off"
//             id="inputCreatePost"
//             name="image"
//             type="file"
//             accept="image/*"
//             onChange={img}
//           />
//           <img width="100%" src={image} alt="" />

//           <button type="submit"> Send</button>
//         </Form>
//       </Formik>
//     </div>
//   );
// }

// export default Image;
