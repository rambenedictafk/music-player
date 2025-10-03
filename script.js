const { useState, useRef } = React;

function MusicButtonPlayer() {
  const [sounds, setSounds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const audioRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const name = file.name.replace(/\.[^/.]+$/, "");
      setSounds(prev => [...prev, { name, url }]);
    });
  };

  const playSound = (index) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(sounds[index].url);
    audioRef.current.play();
    setCurrentIndex(index);
    audioRef.current.onended = () => setCurrentIndex(null);
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentIndex(null);
    }
  };

  const nextSound = () => {
    if (sounds.length === 0) return;
    const nextIndex = currentIndex !== null ? (currentIndex + 1) % sounds.length : 0;
    playSound(nextIndex);
  };

  const updateName = (index, newName) => {
    setSounds(prev => prev.map((sound, i) => 
      i === index ? { ...sound, name: newName } : sound
    ));
    setEditingIndex(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-6 flex gap-3 justify-center">
          <label className="bg-blue-500 text-white px-5 py-2 rounded cursor-pointer hover:bg-blue-600">
            Upload Audio
            <input 
              type="file" 
              accept="audio/*" 
              multiple 
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={stopSound}
            className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600"
          >
            Stop
          </button>
          
          <button
            onClick={nextSound}
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {sounds.map((sound, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => playSound(index)}
                className={`w-24 h-24 rounded-full shadow-lg transition ${
                  currentIndex === index
                    ? 'bg-yellow-400 scale-95'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              />
              {editingIndex === index ? (
                <input
                  type="text"
                  defaultValue={sound.name}
                  onBlur={(e) => updateName(index, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateName(index, e.target.value)}
                  autoFocus
                  className="text-sm mt-2 text-center border-2 border-blue-400 rounded px-1 w-full"
                />
              ) : (
                <p 
                  onClick={() => setEditingIndex(index)}
                  className="text-sm mt-2 text-center text-gray-700 cursor-pointer hover:text-blue-500"
                >
                  {sound.name}
                </p>
              )}
            </div>
          ))}
        </div>

        {sounds.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            Upload audio files to start
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<MusicButtonPlayer />, document.getElementById('root'));
