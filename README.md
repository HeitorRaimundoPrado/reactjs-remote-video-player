# Video Player with YouTube Client

This is a video player application with a front-end written in React and a back-end written in Flask. The application allows users to play remote audio files saved on a server and search for, play and download YouTube videos using Python's pytube library.

## Features

- Play local audio files: Users can upload video files from their device and play them directly in the video player.
- YouTube client: Users can search for videos on YouTube and play them within the application.
- Responsive design: The application is designed to be responsive and work well on different devices and screen sizes.

## Technologies Used

- Front-end: React
- Back-end: Flask
- YouTube integration: pytube library

## Prerequisites

To run this application locally, you need to have the following software installed on your machine:

- Python 3
- Flask
- pytube library

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/HeitorRaimundoPrado/reactjs-remote-video-player.git
   ```

2. Install dependencies for the front-end:

   ```bash
   cd reactjs-remote-video-player
   npm install
   ```

3. Install dependencies for the back-end:

   ```bash
   cd api
   pip install -r requirements.txt
   ```

4. Configure the application:

   - In the back-end directory, create a file named `.env` and set the following environment variables:
     ```plaintext
     FLASK_APP=app.py
     FLASK_ENV=development
     ```

  - Configure the url where the application will look for the api. To set it to localhost user the following in your .env.local
    ```plaintext
      VITE_API_BASE_URL="http://localhost:5000"
    ```
     Note: You can change the `FLASK_ENV` to `production` for a production environment.

5. Run the application:

   - In the back-end directory, start the Flask server:
     ```bash
     flask run
     ```

   - In the front-end directory, start the React development server:
     ```bash
     npm run dev
     ```

   The application should now be running locally. Open your web browser and access `http://localhost:5173` to use the video player.

## Building for Android using Ionic Capacitor

If you want to build the application for Android using Ionic Capacitor, follow these steps:



1. Add the Android platform:

   ```bash
   npx cap add android
   ```

2. Build the React application:

   ```bash
   npm run build
   ```

3. Copy the built files to the Android project:

   ```bash
   npx cap sync
   ```

4. Open the Android project in Android Studio:

   ```bash
   npx cap open android
   ```

   This will open the Android project in Android Studio. From there, you can build and run the application on an Android device or emulator.

Note: For more detailed instructions on using Capacitor with Ionic, refer to the [Ionic Capacitor documentation](https://capacitorjs.com/).

## Usage

1. Upload a local video file:
   - Click on the "Upload" button and select an audio file from your device.
   - The audio file will be added to the playlist.
   - Click on the audio title to start playing it.

2. Search and play YouTube videos:
   - Enter a search query in the search bar.
   - Click on the "Search" button.
   - The search results will be displayed below.
   - Click on a video thumbnail to start playing the YouTube video.
   - Click on the download button if you want to have a local copy of the video

3.

 Player Controls:
   - The video player includes basic controls such as play/pause, volume control, and seeking.

## Contributing

Contributions to this project are welcome. Here's how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request describing your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- The React front-end of this application was built using [Vite](https://vitejs.dev/guide/).
- The Flask back-end was developed using the [Flask](https://flask.palletsprojects.com/) framework.
- The YouTube client functionality was implemented using the [pytube](https://pypi.org/project/pytube/) library.

## Contact

If you have any questions or suggestions, feel free to reach out to the project maintainers at heitorrdpp@gmail.com or pedroh.ps0102@gmail.com.
