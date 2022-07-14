import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MentionsTextfield from "./MentionsTextfield";

function DescriptionWithTagsInput(props) {
  const mode = useSelector((state) => state.mode.value)
  const [key, setKey] = useState(0)
  useEffect(() => {
    setKey((key - 1) ** 2)
  }, [mode])
  return (
    <MentionsTextfield {...props} key={String(key)} />
  )
}

export default DescriptionWithTagsInput;