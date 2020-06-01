import React, { useState, useEffect } from "react";
import { Form, Icon } from "semantic-ui-react";

const FormComponent = () => {
  const [errors, setErrors] = useState({});
  const [sample, setSample] = useState([
    {
      CountryCode: "",
      Percent: "100",
      index: 0,
    },
  ]);
  const min = 0;
  const max = 100;

  const handleSampleInputChange = ({ target: { name, value, index } }) => {
    if (name.includes("CountryCode") || name.includes("Percentage")) {
      let totalPercentage = 0;

      if (Number(value) > max || Number(value) < min) return;

      let newSample = sample.map((el) => {
        if (el.index === index) {
          return {
            ...el,
            [name.includes("CountryCode") ? "CountryCode" : "Percent"]: value,
          };
        }
        return el;
      });

      newSample.map((el) => {
        totalPercentage += Number(el.Percent);
        return totalPercentage;
      });

      const diff = totalPercentage - 100;

      if (diff > 0 && sample.length > 1) {
        let greaterSample = newSample[0];
        newSample.map((el) => {
          if (el.Percent > greaterSample.Percent && el.index !== index)
            greaterSample = el;
          return el;
        });

        newSample = newSample.map((el) => {
          if (el.index === greaterSample.index) {
            const newPercent = Number(el.Percent) - Number(diff);
            return {
              ...el,
              Percent: newPercent < min ? min : newPercent,
            };
          }
          return el;
        });
      } else if (diff < 0 && sample.length > 1) {
        let smallerSample = newSample[0];
        newSample.map((el) => {
          if (el.Percent < smallerSample.Percent && el.index !== index)
            smallerSample = el;
          return el;
        });

        newSample = newSample.map((el) => {
          if (el.index === smallerSample.index) {
            const newPercent = Number(el.Percent) + Number(diff);
            return {
              ...el,
              Percent: newPercent > max ? max : newPercent,
            };
          }
          return el;
        });
      }

      // newSample = newSample.map(el => {
      //   if (el.index > max) {
      //     return {
      //       ...el,
      //       Percent: Number(el.Percent) + Number(diff),
      //     };
      //   }
      //   return el;
      // });

      setSample(newSample);
    }
  };

  const addSampleForm = () => {
    let totalPercentage = 0;

    sample.map((el) => {
      totalPercentage += Number(el.Percent);
      return totalPercentage;
    });
    setSample([
      ...sample,
      {
        CountryCode: "",
        Percent: `${100 - totalPercentage}`,
        index: sample[sample.length - 1].index + 1,
      },
    ]);
  };

  const removeSampleForm = (i) => {
    if (sample.length > 1 && i !== 0) {
      const removedSample = sample.find(({ index }) => index === i);
      const removedPerc = removedSample ? removedSample.Percent : 0;

      let totalPercentage = 0;

      sample.map((el) => {
        totalPercentage += Number(el.Percent);
        return totalPercentage;
      });

      let newForm = sample.filter(({ index }) => index !== i);

      let smallerSample = newForm[0];
      newForm.map((el) => {
        if (el.Percent < smallerSample.Percent) smallerSample = el;
        return smallerSample;
      });

      newForm = newForm.map((el) => {
        if (el.index === smallerSample.index) {
          return {
            ...el,
            Percent: Number(el.Percent) + Number(removedPerc),
          };
        }
        return el;
      });

      setSample([...newForm]);
    }
  };

  useEffect(() => {
    let totalPercentage = 0;
    let error = "";

    sample.map((el) => {
      totalPercentage += Number(el.Percent);
      if (!el.CountryCode) error = "Please, fill all the countries";
      return totalPercentage;
    });

    if (error || totalPercentage !== 100) {
      setErrors({
        ...errors,
        Sample: error || "The total percentage should be 100",
      });
    } else {
      setErrors({
        ...errors,
        Sample: "",
      });
    }
  }, [errors, sample]);

  return (
    <div>
      <div className="form-label">{"Select countries you are targetting"}?</div>
      {sample.map(({ CountryCode: countryCode = "", Percent, index }) => {
        return (
          <Form.Group key={index} className="country-target relative">
            <Form.Field width={10}>
              <Form.Input
                value={Percent}
                className="input-percentage"
                type="number"
                name={`Percentage${index}`}
                max={100}
                min={0}
                actionPosition="left"
                onChange={({ target: { name, value } }) =>
                  handleSampleInputChange({
                    target: { name, value, index },
                  })
                }
              />
            </Form.Field>
            <Form.Field width={6}>
              <div className="action-icons">
                <Icon
                  name="add circle"
                  className="circle-add cursor-pointer"
                  size="big"
                  onClick={() => addSampleForm()}
                />
                {index !== 0 && (
                  <Icon
                    name="times circle"
                    className="circle-remove cursor-pointer"
                    size="big"
                    onClick={() => removeSampleForm(index)}
                  />
                )}
              </div>
            </Form.Field>
          </Form.Group>
        );
      })}
    </div>
  );
};

export default FormComponent;
