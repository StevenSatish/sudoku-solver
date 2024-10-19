function Note({ note, position }) {
  return (
    <div className="note" style={{ gridArea: position }}>
      {note}
    </div>
  );
}

export default Note;
