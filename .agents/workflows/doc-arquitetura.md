---
description: Analisa um projeto de software e gera um documento de especificações técnicas em Markdown, cobrindo arquitetura, infraestrutura, banco de dados e APIs.
---

Instructions
Doc Arquitetura
Um assistente automatizado focado em varrer um projeto e gerar uma documentação técnica consolidada para acelerar o desenvolvimento e facilitar o onboarding.

Quando Usar
Quando o usuário pedir para gerar a documentação de um projeto.
Quando o usuário quiser mapear a arquitetura de um código-fonte.
Quando for solicitado um documento para buscar informações importantes de uma base de código.
Passos
Analise cuidadosamente todos os arquivos de código, configurações e infraestrutura fornecidos.
Monte um documento técnico estruturado em Markdown contendo os seguintes tópicos fundamentais:
Visão Geral e Domínio: Objetivo principal do software e regras de negócio essenciais.
Arquitetura e Nuvem: Mapeamento da infraestrutura e recursos de cloud (com atenção especial a serviços como AWS S3, Lambda, Glue, Athena e instâncias EC2), uso de containers (Docker) ou infraestrutura como código (Terraform).
Stack Tecnológico e Banco de Dados: Linguagens principais (como Python, Java, JavaScript), frameworks e modelagem de dados relacionais e não-relacionais (SQL/NoSQL).
Integrações e APIs: Endpoints principais, consumidores e contratos de dados.
Observabilidade e CI/CD: Como os logs, métricas e alertas estão configurados (por exemplo, dashboards e monitores no Datadog) e como o fluxo de deploy funciona (Git, GitHub Actions, etc.).
Formate a saída como um documento claro, objetivo e fácil de buscar (usando headings apropriados, bullet points e blocos de código).
Avisos
Se algum pilar não estiver presente nos arquivos fornecidos, mencione explicitamente que a informação não foi encontrada em vez de inventar dados.
Mantenha a documentação focada na realidade técnica. A ideia é ser um documento de consulta rápida para o dia a dia da engenharia de software.