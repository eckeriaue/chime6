defmodule SignalServer.MixProject do
  use Mix.Project

  def project do
    [
      app: :signal_server,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      {:phoenix, "~> 1.7"},
      {:phoenix_pubsub, "~> 2.1"},
      {:jason, "~> 1.4"},
      {:corsica, "~> 2.0"}
    ]
  end

end
