import { createZoomUser } from './zoom-user';
import dotenv from 'dotenv';

dotenv.config();

test('Create a Zoom user', async () => {
    console.log(process.env.API_KEY);
    // Act
    const auth = await createZoomUser(process.env.ZOOM_EMAIL, 1, 'random', 'user');
    // Assert
    console.log(auth);
    expect(typeof auth).toBe('object');
});
