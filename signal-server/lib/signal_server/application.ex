defmodule SignalServer.Application do
  use Application

  def start(_type, _args) do
    children = [
      {Phoenix.PubSub, name: SignalServer.PubSub},
      SignalServerWeb.Endpoint
    ]
    opts = [strategy: :one_for_one, name: SignalServer.Supervisor]
    Supervisor.start_link(children, opts)
  end

end
