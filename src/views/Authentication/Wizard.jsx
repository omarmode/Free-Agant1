import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";

// قائمة ثابتة للبلدان
const countries = [
  "algeria",
  "bahrain",
  "comoros",
  "djibouti",
  "egypt",
  "iraq",
  "jordan",
  "kuwait",
  "lebanon",
  "libya",
  "morocco",
  "oman",
  "palestine",
  "qatar",
  "saudi arabia",
  "somalia",
  "sudan",
  "syria",
  "tunisia",
  "united arab emirates",
  "yemen",
];

// const token = "1|kPQEgSSkudO5SuvOFHNGN6SF6UFxHpPiGfb99AQd780d4e26"; // توكن مؤقت
const token = localStorage.getItem("authToken");
const Wizard = () => {
  const [activeStep, setActiveStep] = useState(0); // لإدارة الخطوة الحالية
  const [categories, setCategories] = useState([]); // لتخزين التصنيفات
  const [currencies, setCurrencies] = useState([]); // لتخزين العملات
  const [timezones, setTimezones] = useState([]); // لتخزين المناطق الزمنية
  const [formData, setFormData] = useState({
    name: "",
    // registration_number: "",
    address: "",
    town: "",
    state: "",
    zip_code: "",
    phone: "",
    business_category_id: "",
    country: "",
    date_format: "m-d-Y", // التنسيق الافتراضي
    currency_id: "", // العملة
    timezone_id: "", // المنطقة الزمنية
    unit: "kg", // الوحدة الافتراضية
    company_start_date: "", // تاريخ بدء الشركة
    first_accounting_year_end_date: "", // نهاية السنة المالية الأولى
    app_start_date: "", // تاريخ بدء التطبيق
    is_registered: false, // هل الشركة مسجلة ضريبياً
    effective_from: "", // تاريخ بدء التطبيق الضريبي
    tax_entity_name: "", // اسم الجهة الضريبية
    tax_rate: "",
    account_name: "", // اسم الحساب البنكي
    bank_name: "", // اسم البنك
    account_number: "", // رقم الحساب
    sort_code: "", // كود التوجيه البنكي
    opening_balance: "", // الرصيد الافتتاحي
  });
  const [errors, setErrors] = useState({}); // لإدارة أخطاء الحقول

  // خطوات الـ Wizard
  const steps = [
    "Business Details",
    "Display Formats",
    "Accounting Dates",
    "Sales Tax Details",
    "Banking Setup",
  ];

  // جلب التصنيفات + العملات + المناطق الزمنية عند تحميل الصفحة
  useEffect(() => {
    const fetchCategories = axios.get(
      "https://accounting.oncallwork.com/api/business/categories",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fetchCurrencies = axios.get(
      "https://accounting.oncallwork.com/api/currencies",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fetchTimezones = axios.get(
      "https://accounting.oncallwork.com/api/timezones",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // تنفيذ كل الطلبات في نفس الوقت باستخدام Promise.all
    Promise.all([fetchCategories, fetchCurrencies, fetchTimezones])
      .then(([categoriesRes, currenciesRes, timezonesRes]) => {
        setCategories(categoriesRes.data.data); // تخزين التصنيفات
        setCurrencies(currenciesRes.data.data); // تخزين العملات
        setTimezones(timezonesRes.data.data); // تخزين المناطق الزمنية
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // التحقق من الحقول قبل الإرسال
  const validate = () => {
    let tempErrors = {};

    if (!formData.name) tempErrors.name = "Business Name is required.";
    // if (!formData.registration_number.match(/^\d+$/))
    //   tempErrors.registration_number = "Registration Number must be numeric.";
    if (!formData.zip_code.match(/^\d+$/))
      tempErrors.zip_code = "Zip Code must contain only numbers.";
    if (!formData.phone.match(/^\+\d+$/))
      tempErrors.phone = "Phone must start with country code (e.g., +201...)";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // تحديث بيانات النموذج عند تغيير الحقول
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // إرسال البيانات للخطوة الأولى
  const handleSubmitStepOne = (e) => {
    e.preventDefault();

    const stepOneData = {
      name: formData.name,
      address: formData.address,
      town: formData.town,
      state: formData.state,
      zip_code: formData.zip_code,
      phone: formData.phone,
      business_category_id: formData.business_category_id,
      country: formData.country,
    };

    axios
      .post(
        "https://accounting.oncallwork.com/api/setup/step-one",
        stepOneData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Step 1 submitted successfully:", response.data);
        setActiveStep((prevStep) => prevStep + 1); // الانتقال للخطوة التالية
      })
      .catch((error) => {
        console.error(
          "Error submitting step one:",
          error.response?.data || error
        );
      });
  };

  // إرسال البيانات للخطوة الثانية
  const handleSubmitStepTwo = (e) => {
    e.preventDefault();

    axios
      .post("https://accounting.oncallwork.com/api/setup/step-two", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Step 2 submitted successfully:", response.data);
        setActiveStep((prevStep) => prevStep + 1); // الانتقال للخطوة التالية
      })
      .catch((error) => {
        console.error("Error submitting step two:", error);
      });
  };
  // Helper function لتحويل التاريخ إلى d-m-Y
  // Helper function لتحويل التاريخ إلى d-m-Y بشكل آمن
  const formatDate = (date) => {
    if (!date) return ""; // إذا كان التاريخ فارغًا
    const [year, month, day] = date.split("-");
    if (year && month && day) {
      return `${day}-${month}-${year}`; // تحويل Y-m-d إلى d-m-Y
    }
    console.error("Invalid date format:", date); // في حال كان التنسيق خاطئًا
    return "";
  };

  // إرسال البيانات للخطوة الثالثة
  const handleSubmitStepThree = (e) => {
    e.preventDefault();

    // التحقق من أن الحقول الثلاثة ليست فارغة
    if (
      !formData.company_start_date ||
      !formData.first_accounting_year_end_date ||
      !formData.app_start_date
    ) {
      console.error("All date fields are required.");
      return;
    }

    // تجهيز البيانات بالتنسيق الصحيح
    const formattedData = {
      company_start_date: formatDate(formData.company_start_date),
      first_accounting_year_end_date: formatDate(
        formData.first_accounting_year_end_date
      ),
      app_start_date: formatDate(formData.app_start_date),
    };

    console.log("Formatted Data:", formattedData); // عرض البيانات للتحقق

    // إرسال البيانات إلى API
    axios
      .post(
        "https://accounting.oncallwork.com/api/setup/step-three",
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Step 3 submitted successfully:", response.data);
        setActiveStep((prevStep) => prevStep + 1); // الانتقال للخطوة التالية
      })
      .catch((error) => {
        console.error("Error submitting step three:", error);
      });
  };
  const handleSubmitStepFour = (e) => {
    e.preventDefault();

    // تحقق من أن جميع الحقول مطلوبة
    if (
      !formData.effective_from ||
      !formData.tax_entity_name ||
      !formData.tax_rate
    ) {
      console.error("All fields for tax details are required.");
      return;
    }

    const stepFourData = {
      is_registered: formData.is_registered,
      effective_from: formData.effective_from,
      name: formData.tax_entity_name,
      tax_rate: parseFloat(formData.tax_rate), // تأكد من أن النسبة رقمية
    };

    axios
      .post(
        "https://accounting.oncallwork.com/api/setup/step-four",
        stepFourData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Step 4 submitted successfully:", response.data);
        setActiveStep((prevStep) => prevStep + 1); // الانتقال للخطوة التالية
      })
      .catch((error) => {
        console.error(
          "Error submitting step four:",
          error.response?.data || error
        );
      });
  };
  const history = useHistory();

  const handleSubmitStepFive = (e) => {
    e.preventDefault();

    // تحقق من أن جميع الحقول الضرورية معبأة
    if (
      !formData.account_name ||
      !formData.bank_name ||
      !formData.account_number ||
      !formData.sort_code ||
      !formData.opening_balance
    ) {
      console.error("All banking fields are required.");
      return;
    }
    const stepFiveData = {
      account_name: formData.account_name,
      bank_name: formData.bank_name,
      account_number: formData.account_number,
      sort_code: formData.sort_code,
      opening_balance: parseFloat(formData.opening_balance), // تحويل الرصيد إلى رقم
    };

    axios
      .post(
        "https://accounting.oncallwork.com/api/setup/step-five",
        stepFiveData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Step 5 submitted successfully:", response.data);
        // setActiveStep((prevStep) => prevStep + 1); // الانتقال إلى الخطوة التالية
        // history.push("login-classic");
        history.push("login-classic");
      })
      .catch((error) => {
        console.error(
          "Error submitting step five:",
          error.response?.data || error
        );
      });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 5, padding: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Setup Wizard
      </Typography>

      {/* Stepper للتنقل بين الخطوات */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* عرض المحتوى الخاص بكل خطوة */}
      {activeStep === 0 && (
        <Box component="form" onSubmit={handleSubmitStepOne}>
          <TextField
            label="Business Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleInputChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          {/* <TextField
            label="Registration Number"
            name="registration_number"
            fullWidth
            margin="normal"
            value={formData.registration_number}
            onChange={handleInputChange}
            error={Boolean(errors.registration_number)}
            helperText={errors.registration_number}
          /> */}
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleInputChange}
          />
          <TextField
            label="Town"
            name="town"
            fullWidth
            margin="normal"
            value={formData.town}
            onChange={handleInputChange}
          />
          <TextField
            label="State"
            name="state"
            fullWidth
            margin="normal"
            value={formData.state}
            onChange={handleInputChange}
          />
          <TextField
            label="Zip Code"
            name="zip_code"
            fullWidth
            margin="normal"
            value={formData.zip_code}
            onChange={handleInputChange}
            error={Boolean(errors.zip_code)}
            helperText={errors.zip_code}
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleInputChange}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Business Category</InputLabel>
            <Select
              name="business_category_id"
              value={formData.business_category_id}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Country</InputLabel>
            <Select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            >
              {countries.map((country, index) => (
                <MenuItem key={index} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Save and Continue
          </Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box component="form" onSubmit={handleSubmitStepTwo}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Currency</InputLabel>
            <Select
              name="currency_id"
              value={formData.currency_id}
              onChange={handleInputChange}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency.id} value={currency.id}>
                  {currency.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Timezone</InputLabel>
            <Select
              name="timezone_id"
              value={formData.timezone_id}
              onChange={handleInputChange}
            >
              {timezones.map((timezone) => (
                <MenuItem key={timezone.id} value={timezone.id}>
                  {timezone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Date Format</InputLabel>
            <Select
              name="date_format"
              value={formData.date_format}
              onChange={handleInputChange}
            >
              <MenuItem value="Y-m-d">Y-m-d</MenuItem>
              <MenuItem value="m-d-Y">m-d-Y</MenuItem>
              <MenuItem value="d-m-Y">d-m-Y</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Unit</InputLabel>
            <Select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
            >
              <MenuItem value="kg">Kilogram (kg)</MenuItem>
              <MenuItem value="mile">Mile (mile)</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Save and Continue
          </Button>
        </Box>
      )}
      {activeStep === 2 && (
        <Box component="form" onSubmit={handleSubmitStepThree}>
          <TextField
            label="Company Start Date"
            name="company_start_date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.company_start_date}
            onChange={handleInputChange}
            error={!formData.company_start_date}
            helperText={
              !formData.company_start_date ? "This field is required." : ""
            }
          />

          <TextField
            label="First Accounting Year End Date"
            name="first_accounting_year_end_date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.first_accounting_year_end_date}
            onChange={handleInputChange}
            error={!formData.first_accounting_year_end_date}
            helperText={
              !formData.first_accounting_year_end_date
                ? "This field is required."
                : ""
            }
          />

          <TextField
            label="App Start Date"
            name="app_start_date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.app_start_date}
            onChange={handleInputChange}
            error={!formData.app_start_date}
            helperText={
              !formData.app_start_date ? "This field is required." : ""
            }
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Save and Continue
          </Button>
        </Box>
      )}
      {activeStep === 3 && (
        <Box component="form" onSubmit={handleSubmitStepFour}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Is Registered</InputLabel>
            <Select
              name="is_registered"
              value={formData.is_registered}
              onChange={handleInputChange}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Effective From"
            name="effective_from"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.effective_from}
            onChange={handleInputChange}
          />

          <TextField
            label="Tax Entity Name"
            name="tax_entity_name"
            fullWidth
            margin="normal"
            value={formData.tax_entity_name}
            onChange={handleInputChange}
          />

          <TextField
            label="Tax Rate"
            name="tax_rate"
            type="number"
            fullWidth
            margin="normal"
            value={formData.tax_rate}
            onChange={handleInputChange}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Save and Continue
          </Button>
        </Box>
      )}
      {activeStep === 4 && (
        <Box component="form" onSubmit={handleSubmitStepFive}>
          <TextField
            label="Account Name"
            name="account_name"
            fullWidth
            margin="normal"
            value={formData.account_name}
            onChange={handleInputChange}
          />

          <TextField
            label="Bank Name"
            name="bank_name"
            fullWidth
            margin="normal"
            value={formData.bank_name}
            onChange={handleInputChange}
          />

          <TextField
            label="Account Number"
            name="account_number"
            fullWidth
            margin="normal"
            value={formData.account_number}
            onChange={handleInputChange}
          />

          <TextField
            label="Sort Code"
            name="sort_code"
            fullWidth
            margin="normal"
            value={formData.sort_code}
            onChange={handleInputChange}
          />

          <TextField
            label="Opening Balance"
            name="opening_balance"
            type="number"
            fullWidth
            margin="normal"
            value={formData.opening_balance}
            onChange={handleInputChange}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Save and Continue
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Wizard;
