// Get references to the elements
const captureButton = document.getElementById('captureButton');
const captureArea = document.getElementById('captureArea');
const canvas = document.getElementById('canvas');

// Add click event listener to the capture button
captureButton.addEventListener('click', () => {
    // Get the dimensions of the capture area
    const width = captureArea.clientWidth;
    const height = captureArea.clientHeight;

    // Set the canvas size to match the capture area
    canvas.width = width;
    canvas.height = height;

    // Get the canvas context
    const context = canvas.getContext('2d');

    // Draw the capture area onto the canvas
    context.drawWindow(window, 0, 0, width, height, 'rgb(255, 255, 255)');

    // Convert the canvas image to a data URL
    const dataURL = canvas.toDataURL();

    // Open a new window and display the captured image
    const newWindow = window.open();
    newWindow.document.write(`<img src="${dataURL}" alt="Captured Image" />`);
});
