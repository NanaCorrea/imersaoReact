import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'
import { Popover } from '@mui/material'
import { getNome } from '../services/getNome'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQwODkwNiwiZXhwIjoxOTU4OTg0OTA2fQ.1KGseWVCdZfq9MGUMAFM0eWIj5bzyHApwlx68lf26_o'
const SUPABASE_URL = 'https://lmovgrlioctgpdnikert.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMensagensEmTempoReal(adicionaMensagem) {
  return supabaseClient
    .from('mensagens')
    .on('INSERT', respostaLive => {
      adicionaMensagem(respostaLive.new)
    })
    .subscribe()
}

export default function ChatPage() {
  const roteamento = useRouter()
  const usuarioLogado = roteamento.query.username
  const [mensagem, setMensagem] = React.useState('')
  const [listaDeMensagens, setListaDeMensagens] = React.useState([])
  let botao = ''

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data)
      })
    escutaMensagensEmTempoReal(novaMensagem => {
      setListaDeMensagens(valorAtualDaLista => {
        return [novaMensagem, ...valorAtualDaLista]
      })
    })
  }, [])

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: usuarioLogado,
      texto: novaMensagem
    }

    supabaseClient
      .from('mensagens')
      .insert([mensagem])
      .then(({ data }) => {})
    setMensagem('')
  }
  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://i.pinimg.com/originals/e4/cb/62/e4cb6218d0a4ccc05d9aaef7877cdba9.jpg)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px'
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px'
          }}
        >
          {listaDeMensagens.length === 0 ? (
            <img
              className="loading"
              src={`https://icon-library.com/images/loading-icon-animated-gif/loading-icon-animated-gif-7.jpg`}
            />
          ) : (
            <>
              <MessageList
                mensagens={listaDeMensagens}
                setListaDeMensagens={setListaDeMensagens}
              />
              <Box
                as="form"
                styleSheet={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <TextField
                  value={mensagem}
                  onChange={event => {
                    const valor = event.target.value
                    setMensagem(valor)
                  }}
                  onKeyPress={event => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleNovaMensagem(mensagem)
                    }
                  }}
                  placeholder="Insira sua mensagem aqui..."
                  type="textarea"
                  styleSheet={{
                    width: '100%',
                    border: '0',
                    resize: 'none',
                    borderRadius: '5px',
                    padding: '6px 8px',
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                    marginRight: '12px',
                    color: appConfig.theme.colors.neutrals[200]
                  }}
                />
                <ButtonSendSticker
                  onStickerClick={sticker => {
                    handleNovaMensagem(':sticker:' + sticker)
                  }}
                />
                {mensagem.length < 1 ? (botao = true) : (botao = false)}
                <Button
                  disabled={botao}
                  onClick={event => {
                    handleNovaMensagem(mensagem)
                  }}
                  styleSheet={{
                    borderRadius: '50%',
                    minHeight: '50px',
                    minWidth: '50px',
                    marginBottom: '8px'
                  }}
                  label=">>"
                  buttonColors={{
                    contrastColor: appConfig.theme.colors.neutrals['000'],
                    mainColor: appConfig.theme.colors.primary[500],
                    mainColorLight: appConfig.theme.colors.primary[400],
                    mainColorStrong: appConfig.theme.colors.primary[600]
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          // variant="tertiary"
          // colorVariant="primary"
          label="Logout"
          href="/"
          styleSheet={{
            backgroundColor: appConfig.theme.colors.primary[500],
            hover: {
              backgroundColor: appConfig.theme.colors.primary[600]
            }
          }}
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  const [usuarioDestacado, setUsuarioDestacado] = React.useState()
  const [nomeUsuario, setNomeUsuario] = React.useState()
  const [openedPopover, setOpenedPopover] = React.useState(false)
  const [popoverAnchor, setPopoverAnchor] = React.useState(null)

  const handlePopoverOpen = event => {
    setOpenedPopover(true)
    setPopoverAnchor(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setOpenedPopover(false)
  }

  const popoverEnter = () => {
    setOpenedPopover(true)
  }
  const popoverLeave = () => {
    setOpenedPopover(false)
  }
  function deleteMessage(mensagem) {
    supabaseClient
      .from('mensagens')
      .delete()
      .match({ id: mensagem.id })
      .then(({ data }) => {
        const messageListFiltered = props.mensagens.filter(messageFiltered => {
          return messageFiltered.id != data[0].id
        })
        props.setListaDeMensagens(messageListFiltered)
      })
  }
  function icondelete(mensagem) {
    if (mensagem.from == props.userlogged) {
      return (
        <Button
          styleSheet={{
            borderRadius: '50%',
            width: '30px',
            marginLeft: '5px',
            color: 'white',
            hover: {
              backgroundColor: appConfig.theme.colors.primary[600]
            }
          }}
          variant="primary"
          colorVariant="warning"
          label={<Icon label="icon trash" name="FaRegTrashAlt" />}
          buttonColors={{
            mainColor: appConfig.theme.colors.primary[500]
          }}
          onClick={() => {
            deleteMessage(mensagem)
          }}
        />
      )
    }
  }
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'hidden',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px'
      }}
    >
      <Popover
        open={openedPopover}
        BackdropProps={{ sx: { pointerEvents: 'none' } }}
        PaperProps={{
          sx: { pointerEvents: 'auto' },
          onMouseEnter: popoverEnter,
          onMouseLeave: popoverLeave
        }}
        sx={{
          pointerEvents: 'none',
          height: 400,
          width: {
            xs: 200,
            sm: 300,
            md: 400,
            lg: 500,
            xl: 500
          }
        }}
        anchorEl={popoverAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            color: appConfig.theme.colors.neutrals[100],
            marginBottom: '16px'
          }}
        >
          <Image
            src={`https://github.com/${usuarioDestacado}.png`}
            styleSheet={{
              marginBottom: '16px',
              border: '1px solid'
            }}
          />
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}
          >
            <Text
              styleSheet={{
                fontFamily: 'Play',
                color: 'black'
              }}
            >
              {nomeUsuario}
            </Text>

            <Button
              iconName="FaGithub"
              href={`https://github.com/${usuarioDestacado}`}
              buttonColors="none"
              styleSheet={{
                maxWidth: '20px',
                maxHeight: '20px',
                marginLeft: '10px',
                marginRight: '10px'
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals['000'],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600]
              }}
            ></Button>
          </Box>
        </Box>
      </Popover>
      {props.mensagens.map(mensagem => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              maxWidth: '100%',
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700]
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px'
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                  marginBottom: '-4px'
                }}
                src={`https://github.com/${mensagem.de}.png`}
                onMouseEnter={event => {
                  handlePopoverOpen(event)
                  setUsuarioDestacado(mensagem.de)
                  getNome(mensagem.de).then(nome => {
                    setNomeUsuario(nome)
                  })
                }}
                onMouseLeave={handlePopoverClose}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300]
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              {icondelete(mensagem)}
            </Box>

            {mensagem.texto.startsWith(':sticker:') ? (
              <Image
                src={mensagem.texto.replace(':sticker:', '')}
                styleSheet={{
                  maxHeight: '150px'
                }}
              />
            ) : (
              mensagem.texto
            )}
          </Text>
        )
      })}
    </Box>
  )
}
