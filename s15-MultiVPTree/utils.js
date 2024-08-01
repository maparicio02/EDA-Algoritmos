async function getImageFeatures(image) {
    return new Promise((resolve, reject) => {
        cv['onRuntimeInitialized'] = () => {
            try {
                const src = cv.imread(image);
                const gray = new cv.Mat();
                cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

                const orb = new cv.ORB();
                const keypoints = new cv.KeyPointVector();
                const descriptors = new cv.Mat();
                orb.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);

                const features = [];
                for (let i = 0; i < descriptors.rows; i++) {
                    features.push(Array.from(descriptors.row(i).data));
                }

                gray.delete();
                src.delete();
                keypoints.delete();
                descriptors.delete();
                orb.delete();

                resolve(features);
            } catch (error) {
                reject(error);
            }
        };
    });
}
