import { Box, Button, Text, TextField, Image } from '@skynexui/components'
import React from 'react'
import { useRouter } from 'next/router'
import appConfig from '../config.json'

function Titulo(props) {
  const Tag = props.tag || 'h1'
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals['000']};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

export default function PaginaInicial() {
  const [username, setUsername] = React.useState('nanacorrea')
  const roteamento = useRouter()

  return (
    <>
      <Box
        styleSheet={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary['900'],
          backgroundImage:
            'url(https://i.pinimg.com/originals/e4/cb/62/e4cb6218d0a4ccc05d9aaef7877cdba9.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundBlendMode: 'multiply'
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row'
            },
            width: '100%',
            maxWidth: '700px',
            borderRadius: '25px 0px 25px 25px',
            padding: '32px',
            margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700]
          }}
        >
          <Box
            as="form"
            onSubmit={function (infosdoevento) {
              infosdoevento.preventDefault()
              console.log('Alguém submeteu o form')
              roteamento.push('./')
            }}
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: '100%', sm: '50%' },
              textAlign: 'center',
              marginBottom: '32px'
            }}
          >
            <Titulo tag="h2">Você destravou o DEVER DE CASA SURPRESA!</Titulo>
            <Text
              variant="body3"
              styleSheet={{
                marginTop: '32px',
                marginBottom: '32px',
                color: appConfig.theme.colors.neutrals[300]
              }}
            >
              Fica tranquilo, é brincadeira, você apenas está na página errada,
              verifique o endereço!
            </Text>

            <Button
              type="submit"
              label="Voltar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals['000'],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600]
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px 0px 10px 10px',
              flex: 1,
              minHeight: '200px'
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginTop: '32px',
                marginBottom: '16px'
              }}
              src={`https://mundoovo.com.br/assets/shutterstock_79744471.jpg`}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >
              PEGADINHA!!!
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  )
}
