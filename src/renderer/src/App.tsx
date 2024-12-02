import { useState, useEffect } from 'react'
import { IChangeEvent } from '@rjsf/core'
import { RJSFSchema, UiSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/mui'
import $RefParser from "@apidevtools/json-schema-ref-parser"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const log = (type): (...args: any[]) => void => console.log.bind(console, type)

const theme = createTheme()

const uiSchema: UiSchema = {
  'ui:submitButtonOptions': {
    'submitText': 'Download'
  },
  'ui:order': [
    "datasetId",
    "bibId",
    "datasetType",
    "experimentalConditionId",
    "*",
  ],
  nuclide: {
    mass: {
      "ui:help": "input 0 if the target is of natural abundance"
    }
  },
  observable: {
    uncertainties: {
      items: {
        description: {
          "ui:placeholder": "hoge"
        },
        value: {
          oneOf: [
            {
              "ui:placeholder": "0"
            },
            {
              "ui:placeholder": "+3-5"
            },
            {
              "ui:placeholder": "5%"
            },
            {
              "ui:widget": "radio"
            },
            {
              "ui:widget": "radio",
              "ui:emptyValue": true
            },
            {
              "ui:widget": "radio"
            }
          ]
        }
      }
    }
  }
}

const onSubmit = (data: IChangeEvent<any, RJSFSchema, any>, _: React.FormEvent<HTMLFormElement>): void => {
  console.log('Data submitted: ', data.formData)
  const fileName = 'finename.json'
  const blob = new Blob([JSON.stringify(data.formData)], { type: 'text/json' })
  const jsonURL = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  document.body.appendChild(link)
  link.href = jsonURL
  link.setAttribute('download', fileName)
  link.click()
  document.body.removeChild(link)
}

function App(): JSX.Element {
  const [schema, setSchema] = useState<RJSFSchema | null>(null); // スキーマの状態を管理

  useEffect(() => {
    // 非同期にスキーマをロード
    async function loadSchema() : Promise<void> {
      try {
        const loadedSchema = await $RefParser.dereference('/schema/data.schema.json', { resolve: { file: true } });
        setSchema(loadedSchema as RJSFSchema);
      } catch (error) {
        console.error('スキーマの読み込み中にエラーが発生しました:', error);
      }
    }
    loadSchema()
  }, [])

  if (!schema) {
    // スキーマがロードされるまでローディングメッセージを表示
    return (
      <Box sx={{ width: '400px', ml: 2, mt: 2 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Loading schema ...
        </Typography>
      </Box>
    )
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '400px', ml: 2, mt: 2 }}>
        {/* タイトルを追加 */}
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          μND Entry Generator
        </Typography>
        {/* JSON Schema Form */}
        <Form
          schema={schema}
          uiSchema={uiSchema}
          validator={validator}
          onChange={log('changed')}
          onSubmit={onSubmit}
          onError={log('errors')}
          focusOnFirstError={true}
          experimental_defaultFormStateBehavior={{
            allOf: 'populateDefaults',
            mergeDefaultsIntoFormData: 'useDefaultIfFormDataUndefined',
          }}
        />
      </Box>
    </ThemeProvider>
  )
}

export default App
