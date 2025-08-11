defmodule SignalServer.Endpoint do
  use Phoenix.Endpoint, otp_app: :signal_server

  socket "/socket", SignalServerWeb.UserSocket,
    websocket: true,
    longpoll: false

  plug CORSPlug, origin: "*"

  def init(_key, config) do
    {:ok, config}
  end
end
