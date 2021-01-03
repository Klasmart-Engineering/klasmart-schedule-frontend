import { TextField, TextFieldProps } from "@material-ui/core";
import React, { useState } from "react";
import { validate } from "../../models/ModelH5pCompare";
import { H5PLibraryContent } from "../../models/ModelH5pSchema";

interface H5pCompareProps {
  value: H5PLibraryContent;
}

export function H5pCompare(props: H5pCompareProps) {
  const { value } = props;
  const [result, setResult] = useState<string | boolean>(true);
  const handleChange: TextFieldProps["onChange"] = (e) => {
    const target = JSON.parse(e.target.value);
    setResult(validate(value, target));
  };
  return (
    <div>
      <TextField onChange={handleChange} />
      <pre>{result === true ? null : result}</pre>
    </div>
  );
}
