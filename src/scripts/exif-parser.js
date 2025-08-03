import EXIF from 'exif-js';

export function parseExifData(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const exifData = EXIF.readFromBinaryFile(e.target.result);

      if (exifData) {
        resolve({
          camera: exifData.Make + ' ' + exifData.Model || 'Unknown',
          lens: exifData.LensModel || 'Unknown',
          focalLength: exifData.FocalLength
            ? exifData.FocalLength + 'mm'
            : 'Unknown',
          aperture: exifData.FNumber ? 'f/' + exifData.FNumber : 'Unknown',
          iso: exifData.ISOSpeedRatings || 'Unknown',
          shutterSpeed: exifData.ExposureTime
            ? exifData.ExposureTime + 's'
            : 'Unknown',
          date: exifData.DateTime
            ? new Date(exifData.DateTime).toLocaleDateString()
            : 'Unknown',
          gps:
            exifData.GPSLatitude && exifData.GPSLongitude
              ? {
                  lat: exifData.GPSLatitude,
                  lng: exifData.GPSLongitude,
                }
              : null,
        });
      } else {
        resolve({
          camera: 'No EXIF data',
          lens: 'No EXIF data',
          focalLength: 'No EXIF data',
          aperture: 'No EXIF data',
          iso: 'No EXIF data',
          shutterSpeed: 'No EXIF data',
          date: 'No EXIF data',
          gps: null,
        });
      }
    };

    reader.readAsArrayBuffer(file);
  });
}
