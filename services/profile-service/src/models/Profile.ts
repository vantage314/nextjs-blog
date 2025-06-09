import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: string;
  riskLevel: 'low' | 'moderate' | 'high';
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
  assets: {
    cash: number;
    stocks: number;
    bonds: number;
    realEstate: number;
    other: number;
    taxDeferred: number;
    taxExempt: number;
    taxable: number;
  };
  liabilities: {
    mortgage: number;
    carLoan: number;
    creditCard: number;
    other: number;
  };
  investmentGoals: string[];
  riskTolerance: number;
  investmentExperience: 'beginner' | 'intermediate' | 'advanced';
  taxLossHarvesting: boolean;
  retirementAge: number;
  currentAge: number;
  expectedRetirementIncome: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  riskLevel: { type: String, enum: ['low', 'moderate', 'high'], required: true },
  monthlyIncome: { type: Number, required: true },
  monthlyExpense: { type: Number, required: true },
  savingsRate: { type: Number, required: true },
  assets: {
    cash: { type: Number, default: 0 },
    stocks: { type: Number, default: 0 },
    bonds: { type: Number, default: 0 },
    realEstate: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
    taxDeferred: { type: Number, default: 0 },
    taxExempt: { type: Number, default: 0 },
    taxable: { type: Number, default: 0 }
  },
  liabilities: {
    mortgage: { type: Number, default: 0 },
    carLoan: { type: Number, default: 0 },
    creditCard: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  investmentGoals: [{ type: String }],
  riskTolerance: { type: Number, required: true, min: 1, max: 10 },
  investmentExperience: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true 
  },
  taxLossHarvesting: { type: Boolean, default: false },
  retirementAge: { type: Number, required: true },
  currentAge: { type: Number, required: true },
  expectedRetirementIncome: { type: Number, required: true }
}, {
  timestamps: true
});

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema); 