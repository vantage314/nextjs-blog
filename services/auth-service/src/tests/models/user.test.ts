import mongoose from 'mongoose';
import { User } from '../../models/user';

describe('User Model Test', () => {
  it('should create & save user successfully', async () => {
    const validUser = new User({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'user',
    });
    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.role).toBe(validUser.role);
    expect(savedUser.password).not.toBe(validUser.password); // 密码应该被加密
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({});
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User',
    });
    let err;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should compare password correctly', async () => {
    const user = new User({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
    await user.save();
    
    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);
    
    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
}); 