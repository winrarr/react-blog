interface Props {
  height?: number,
  marginTop?: number,
  marginBottom?: number,
}

const Hr = (props: Props) => {
  return (
    <div className="separator" style={props}>or</div>
  )
}

export default Hr