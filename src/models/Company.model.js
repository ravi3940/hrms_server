





const CompanySchema = new mongoose.Schema({
  name: String,
  address: String,
  logo: String,
  website: String,
  hrEmail: String
});

export default mongoose.model("Company", CompanySchema);
