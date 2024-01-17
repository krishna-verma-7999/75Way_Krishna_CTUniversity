import mongoose from "mongoose";

enum ROLE {
  Admin,
  User,
}

export const userStatusSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  setIn: {
    type: String,
    required: true,
  },
  setOut: {
    type: String,
  },
  Date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Full Day",
  },
});

const userStatusModel = mongoose.model("userStatus", userStatusSchema);

export const setCheckoutTime = (values: Record<string, any>) => {
  return new userStatusModel(values).save();
};

export const getCheckoutDetailsById = (userId: string) => {
  return userStatusModel.findById(userId);
};

export const getCheckoutTimeByDate = async (Date: Date, userId: string) => {
  return await userStatusModel.findOne({ employeeId: userId, Date });
};

export const getCheckoutTimeById = async (id: string) => {
  return await userStatusModel.findById(id);
};

export const getUserCheckoutTime = (userId: string) => {
  return userStatusModel.find({ employeeId: userId });
};

export const updateStatus = async (userId: string, status: string) => {
  console.log(userId);
  return await userStatusModel.updateOne(
    { _id: userId },
    {
      $set: {
        status: status,
      },
    }
  );
};

// ********************************************
export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address format",
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ROLE,
    default: ROLE.User,
  },
  birthday: {
    type: Date,
  },
  salary: {
    type: String,
  },
  joiningDate: {
    type: Date,
  },
  status: {
    type: String,
  },
});

const UserModel = mongoose.model("User", userSchema);

export const createUser = async (values: Record<string, any>) => {
  return await new UserModel(values)
    .save()
    .then((user: any) => user.toObject());
};

export const getExistingAdminByEmail = async (email: string) => {
  return UserModel.findOne({ email });
};

export const getUserById = async (id: string) => {
  return UserModel.findById(id);
};

export const getAllUsers = async () => {
  return userStatusModel.find({});
};

export const getUser = async (userId: string) => {
  return UserModel.findById(userId);
};

export const getAllUser = async () => {
  return await UserModel.find({
    role: {
      $in: ["2", "User"],
    },
  }).select({
    _id: 0,
    birthday: 1,
    email: 1,
    name: 1,
    joiningDate: 1,
  });
};
