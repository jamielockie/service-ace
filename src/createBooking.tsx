import React from 'react';
import * as Yup from 'yup';
import {
  Formik,
  FormikProps,
  FormikErrors,
  Form,
  Field,
  FieldProps,
} from 'formik';
import { Radio, RadioGroup } from '@blueprintjs/core';

// Shape of form values
interface FormValues {
  email: string;
  password: string;
}

interface OtherProps {
  message: string;
}

const SignupSchema = Yup.object().shape({
  type: Yup.string().matches(/(singles|doubles)/),
  playerOne: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  playerTwo: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  playerThree: Yup.string()
    .email('Invalid email')
    .required('Required'),
});

export interface IPlayer {
  name: string;
  id: number;
}

export interface IFormValues {
  type: string;
  playerOne: string;
  playerTwo: string;
  playerThree?: string;
  playerFour?: string;
}

export interface ICreateBookingProps {
  players: IPlayer[];
  onSubmitBooking(formValues: IFormValues): void;
}

export const CreateBooking = (props: ICreateBookingProps) => {
  return (
    <div>
      <h1>Book</h1>
      <Formik
        initialValues={{
          type: 'singles',
          playerOne: '',
          playerTwo: '',
        }}
        // validationSchema={SignupSchema}
        onSubmit={(values) => {
          // same shape as initial values
          props.onSubmitBooking(values);
        }}
        render={({ errors, touched, values }) => (
          <Form>
            <Field
              name="type"
              component={({ field, form }: FieldProps) => (
                <RadioGroup
                  onChange={(e) =>
                    form.setFieldValue('type', e.currentTarget.value)
                  }
                  selectedValue={field.value}
                >
                  <Radio label="Singles" value="singles" />
                  <Radio label="Doubles" value="doubles" />
                </RadioGroup>
              )}
            />
            {errors.type && touched.type ? <div>{errors.type}</div> : null}
            <Field
              name="playerOne"
              component={({ field, form }: FieldProps) => (
                <div className="bp3-select">
                  <select
                    value={field.value}
                    onChange={(e) =>
                      form.setFieldValue('playerOne', e.currentTarget.value)
                    }
                  >
                    <option selected>Choose a player...</option>
                    {props.players.map((p) => (
                      <option value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            />
            <Field
              name="playerTwo"
              component={({ field, form }: FieldProps) => (
                <div className="bp3-select">
                  <select
                    value={field.value}
                    onChange={(e) =>
                      form.setFieldValue('playerTwo', e.currentTarget.value)
                    }
                  >
                    <option selected>Choose a player...</option>
                    {props.players.map((p) => (
                      <option value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            />
            {values.type === 'doubles' && (
              <React.Fragment>
                <Field
                  name="playerThree"
                  component={({ field, form }: FieldProps) => (
                    <div className="bp3-select">
                      <select
                        value={field.value}
                        onChange={(e) =>
                          form.setFieldValue(
                            'playerThree',
                            e.currentTarget.value,
                          )
                        }
                      >
                        <option selected>Choose a player...</option>
                        {props.players.map((p) => (
                          <option value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />
                <Field
                  name="playerFour"
                  component={({ field, form }: FieldProps) => (
                    <div className="bp3-select">
                      <select
                        value={field.value}
                        onChange={(e) =>
                          form.setFieldValue(
                            'playerFour',
                            e.currentTarget.value,
                          )
                        }
                      >
                        <option selected>Choose a player...</option>
                        {props.players.map((p) => (
                          <option value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              </React.Fragment>
            )}
            <button type="submit">Submit</button>
          </Form>
        )}
      />
    </div>
  );
};

export default CreateBooking;
