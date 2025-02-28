import React, { useState, useRef } from "react";
import axios from "axios";
import "./TicketCreateSection.scss";

function TicketCreateSection() {
  const [from, setFrom] = useState("");
  const [priority, setPriority] = useState("Средний");
  const [topic, setTopic] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        newImages.push({
          file: file,
          preview: reader.result,
          uploaded: false,
          uploading: false, // Add uploading status
          progress: 0,
        });

        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (index) => {
    const imageToUpload = images[index];
    if (!imageToUpload || imageToUpload.uploading || imageToUpload.uploaded)
      return; // Safety check

    const formData = new FormData();
    formData.append("images", imageToUpload.file);

    // Set uploading: true immediately
    const newImages = [...images];
    newImages[index] = { ...imageToUpload, uploading: true };
    setImages(newImages);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const newImages = [...images];
        newImages[index] = { ...imageToUpload, progress: i, uploading: true };
        setImages(newImages);
      }

      const response = await axios.post("/api/tickets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newImages = [...images];
      newImages[index] = {
        ...imageToUpload,
        uploaded: true,
        uploading: false,
        progress: 100,
      };
      setImages(newImages);

      console.log("Image uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      const newImages = [...images];
      newImages[index] = {
        ...imageToUpload,
        uploaded: false,
        uploading: false,
        progress: 0,
      };
      setImages(newImages);
    }
  };

  const handleCancelUpload = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("from_user", from);
    formData.append("priority", priority);
    formData.append("topic", topic);
    formData.append("text", text);

    images
      .filter((image) => image.uploaded)
      .forEach((image) => {
        formData.append("attachments", image.file);
      });

    try {
      const response = await axios.post("/api/tickets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Ticket created:", response.data);

      // Reset form fields and images
      setFrom("");
      setPriority("Средний");
      setTopic("");
      setText("");
      setImages([]);

      // Clear input[type="file"]
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  return (
    <section className="ticket-create-section">
      <h2 className="ticket-create-title">Создать заявку</h2>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from">От кого</label>
          <input
            type="text"
            id="from"
            className="form-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Приоритет</label>
          <select
            id="priority"
            className="form-control"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Низкий">Низкий</option>
            <option value="Средний">Средний</option>
            <option value="Высокий">Высокий</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="topic">Тема:</label>
          <input
            type="text"
            id="topic"
            className="form-control"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="text">Текст:</label>
          <textarea
            id="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="attachments">Добавить файлы:</label>
          <input
            type="file"
            id="attachments"
            className="form-control-file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>

        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview-item">
              <div className="image-preview-header">
                <img
                  src={image.preview}
                  alt={`Preview ${index}`}
                  className="image-preview-img"
                />
                <div className="image-info">
                  <div className="image-name">{image.file.name}</div>
                  <div className="image-size">
                    {(image.file.size / 1024).toFixed(2)} KB
                  </div>
                  {image.uploaded ? (
                    <div className="upload-status success">Загружено</div>
                  ) : (
                    <div>
                      {image.progress > 0 && image.progress < 100 ? (
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar"
                            style={{ width: `${image.progress}%` }}
                          />
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="image-preview-actions">
                {!image.uploaded ? (
                  <>
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => handleUpload(index)}
                      disabled={
                        (image.progress > 0 && image.progress < 100) ||
                        image.uploading
                      }
                    >
                      {image.progress > 0 && image.progress < 100
                        ? "Загрузка..."
                        : "Загрузить"}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => handleCancelUpload(index)}
                    >
                      Отменить
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleCancelUpload(index)}
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="submit-btn">
          Создать заявку
        </button>
      </form>
    </section>
  );
}

export default TicketCreateSection;
